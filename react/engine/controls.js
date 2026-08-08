/* =====================================================================
   controls.js — input layer: keyboard, pointer lock, touch, collision
   ---------------------------------------------------------------------
   Everything that turns human input into movement state. The engine
   owns the shared `state` bag (yaw/pitch/keys/vel/move/sprint) and calls
   initControls(reg, state) once at startup; the listeners below mutate
   that bag directly — no React re-renders in the input path.

   Keys are read by physical code AND by layout key, so AZERTY/QWERTZ
   still work. The touch layer is always live; detection only decides
   whether the joystick is visible up front.
   ===================================================================== */

import { SHELL, wx, wz } from './palette.js';
import { reg } from './registry.js';

/* ── 01 ── device detection (guarded for headless environments) ────── */
const mq = typeof matchMedia === 'function' ? matchMedia('(pointer:coarse)') : null;
export const isTouch = (mq && mq.matches) || 'ontouchstart' in window;

/* ── 02 ── keyboard ────────────────────────────────────────────────── */
const setKey = (e, v, state) => {
  if (e.code) state.key[e.code] = v;
  if (e.key && e.key.length === 1) state.key[e.key.toLowerCase()] = v;
  else if (e.key) state.key[e.key] = v;
};
const held = (state, ...names) => names.some(n => state.key[n]);

/* Focus is claimed explicitly: inside an iframe the window gets no
   keydown until it has it. */
export function grabFocus(reg) {
  try { window.focus(); if (reg.canvas) reg.canvas.focus({ preventScroll: true }); } catch (e) {}
}

/* ── 03 ── collision: push the player out of wall segments ─────────── */
const T = 0.14, RADIUS = 0.42;
export function collide(p, walls) {
  for (const w of walls) {
    const minx = Math.min(w.x1, w.x2) - 1, maxx = Math.max(w.x1, w.x2) + 1;
    const minz = Math.min(w.z1, w.z2) - 1, maxz = Math.max(w.z1, w.z2) + 1;
    if (p.x < minx || p.x > maxx || p.z < minz || p.z > maxz) continue;
    /* closest point on the segment to the player */
    const dx = w.x2 - w.x1, dz = w.z2 - w.z1;
    const len2 = dx * dx + dz * dz; if (len2 < 1e-6) continue;
    let t = ((p.x - w.x1) * dx + (p.z - w.z1) * dz) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = w.x1 + dx * t, cz = w.z1 + dz * t;
    let nx = p.x - cx, nz = p.z - cz;
    const d = Math.hypot(nx, nz), min = RADIUS + T;
    if (d < min) {
      if (d < 1e-5) { nx = 1; nz = 0; }
      else { nx /= d; nz /= d; }
      p.x = cx + nx * min; p.z = cz + nz * min;
    }
  }
  /* keep the player inside (or just outside) the shell */
  const pad = 22;
  p.x = Math.max(wx(SHELL[0]) - pad, Math.min(wx(SHELL[2]) + pad, p.x));
  p.z = Math.max(wz(SHELL[1]) - pad, Math.min(wz(SHELL[3]) + pad, p.z));
}

/* ── 04 ── touch joystick + run button ─────────────────────────────── */
let touchUI = false;
let stickId = null, lookId = null, lastLook = { x: 0, y: 0 };

/* The touch layer is always live — detection only decides visibility.
   A first touch on any device turns the controls on. */
function enableTouchUI(state) {
  if (touchUI) return;
  touchUI = true;
  if (reg.touch) reg.touch.classList.add('on');
  if (reg.keys) reg.keys.style.display = 'none';
  if (state.onTouchUI) state.onTouchUI();   // engine re-measures viewport
}

const stickRect = () => reg.stick ? reg.stick.getBoundingClientRect() : { left: 0, top: 0, right: 0, bottom: 0, width: 1, height: 1 };
function updateStick(t, state) {
  const r = reg.stick.getBoundingClientRect();
  let dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
  const max = r.width / 2, d = Math.hypot(dx, dy);
  if (d > max) { dx = dx / d * max; dy = dy / d * max; }
  if (reg.knob) reg.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  state.move = { x: dx / max, y: -dy / max };
}

/* ── 05 ── initControls: attach every listener once ────────────────── */
export function initControls(state) {
  /* keyboard — registered on window AND document; the __it flag stops
     the same event being processed twice as it bubbles */
  for (const target of [window, document]) {
    target.addEventListener('keydown', e => {
      if (e.__it) return;
      e.__it = true;
      setKey(e, true, state);
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') state.sprint = true;
      /* T toggles the translucent wall films */
      if (!e.repeat && (e.code === 'KeyT' || e.key === 't') && state.panelMesh) {
        state.panelMesh.visible = !state.panelMesh.visible;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key) ||
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    });
    target.addEventListener('keyup', e => {
      setKey(e, false, state);
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') state.sprint = false;
    });
  }
  addEventListener('blur', () => { for (const k in state.key) state.key[k] = false; state.sprint = false; });
  addEventListener('pointerdown', () => grabFocus(reg));

  /* mouse look: pointer lock when available, drag-to-look otherwise */
  function lockPointer() {
    if (isTouch || document.pointerLockElement === reg.canvas) return;
    try { const p = reg.canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }
  let dragging = false;
  if (reg.canvas) {
    reg.canvas.addEventListener('mousedown', e => { dragging = true; lockPointer(); e.preventDefault(); });
    addEventListener('mouseup', () => { dragging = false; });
  }
  document.addEventListener('mousemove', e => {
    const locked = document.pointerLockElement === reg.canvas;
    if (!locked && !dragging) return;              // only look when locked or dragging
    if (!locked) e.preventDefault();
    const dx = e.movementX || 0, dy = e.movementY || 0;
    state.yaw -= dx * (locked ? 0.0024 : 0.004);
    state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * (locked ? 0.0022 : 0.0035)));
  });
  addEventListener('dragstart', e => e.preventDefault());
  addEventListener('selectstart', e => e.preventDefault());
  addEventListener('contextmenu', e => { if (state.running) e.preventDefault(); });

  /* touch: joystick + look + run */
  addEventListener('touchstart', e => {
    enableTouchUI(state);
    grabFocus(reg);
    for (const t of e.changedTouches) {
      const r = stickRect();
      const pad = 36;
      const inStick = t.clientX > r.left - pad && t.clientX < r.right + pad &&
                      t.clientY > r.top - pad && t.clientY < r.bottom + pad;
      const onRun = reg.runBtn && reg.runBtn.contains(document.elementFromPoint(t.clientX, t.clientY));
      if (onRun) {
        state.sprint = !state.sprint;
        reg.runBtn.classList.toggle('hot', state.sprint);
        continue;
      }
      if (inStick && stickId === null) { stickId = t.identifier; updateStick(t, state); }
      else if (lookId === null) { lookId = t.identifier; lastLook = { x: t.clientX, y: t.clientY }; }
    }
  }, { passive: true });
  addEventListener('touchmove', e => {
    /* scale to the short edge so a tablet and a phone feel the same */
    const s = 2.2 / Math.min(innerWidth, innerHeight);
    for (const t of e.changedTouches) {
      if (t.identifier === stickId) updateStick(t, state);
      else if (t.identifier === lookId) {
        state.yaw -= (t.clientX - lastLook.x) * s;
        state.pitch = Math.max(-1.1, Math.min(1.1, state.pitch - (t.clientY - lastLook.y) * s * 0.8));
        lastLook = { x: t.clientX, y: t.clientY };
      }
    }
  }, { passive: true });
  const endTouch = e => {
    for (const t of e.changedTouches) {
      if (t.identifier === stickId) {
        stickId = null;
        state.move = { x: 0, y: 0 };
        if (reg.knob) reg.knob.style.transform = 'translate(-50%,-50%)';
      }
      if (t.identifier === lookId) lookId = null;
    }
  };
  addEventListener('touchend', endTouch, { passive: true });
  addEventListener('touchcancel', endTouch, { passive: true });
}
