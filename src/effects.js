import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initEffects() {
  window.__gsap = gsap; window.__ST = ScrollTrigger; // test hooks
    "use strict";
  gsap.registerPlugin(ScrollTrigger);
  var hasLibs = true;
var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
var lerp = function(a,b,t){ return a+(b-a)*t; };
var clamp = function(v,a,b){ return Math.min(b,Math.max(a,v)); };
/* ── preloader: hold the themed gate until EVERYTHING has loaded,
      then fade into the page (the hero entrance starts with the fade) ── */
var plEl = document.getElementById("preloader");
var plStart = Date.now(), plMin = 500, plShown = false;
function reveal(){
  if(plShown || !plEl) return;
  plShown = true;
  var hero = document.getElementById("hero");
  if(hero) hero.classList.add("go");
  plEl.classList.add("gone");
  if(stickerEl) stickerEl.classList.add("in");   /* sticker springs in with the reveal */
  setTimeout(function(){ plEl.style.display = "none"; }, 850);
}
function plReady(){
  if(Date.now()-plStart < plMin){ setTimeout(plReady, Math.max(40, plMin-(Date.now()-plStart))); return; }
  reveal();
}
if(document.readyState === "complete") plReady();
else addEventListener("load", plReady);
setTimeout(reveal, 8000);   /* safety net: never strand the visitor on the loader */
/* ── PROMO STICKER — fixed bottom-right badge ─────────────────────────
   EDIT THE PROMO COPY HERE (loud word + supporting sub-line). The badge
   keeps its hidden pre-entrance pose until reveal() fires, then springs
   in with the page and idles on a slow float. Under reduced motion (RM)
   it snaps straight to the visible resting pose — no dead hidden state. */
var STICKER_COPY = { word: "NEW", sub: "FOUNDING MEMBERS" };
var stickerEl = document.getElementById("sticker");
if(stickerEl){
  var stWord = stickerEl.querySelector(".st-word");
  var stSub = stickerEl.querySelector(".st-sub");
  if(stWord) stWord.textContent = STICKER_COPY.word;
  if(stSub) stSub.textContent = STICKER_COPY.sub;
  stickerEl.setAttribute("aria-label", STICKER_COPY.word + " · " + STICKER_COPY.sub);
  if(RM) stickerEl.classList.add("in");
}
var bar = document.getElementById("bar");
document.getElementById("barX").addEventListener("click", function(){
  bar.classList.add("gone");
  setTimeout(function(){ bar.style.display = "none"; }, 760);
});
var mags = fine ? [].slice.call(document.querySelectorAll(".mag")).map(function(el){
  return {el:el,x:0,y:0,tx:0,ty:0}; }) : [];
mags.forEach(function(m){
  m.el.addEventListener("pointermove", function(e){
    var r = m.el.getBoundingClientRect();
    m.tx = (e.clientX - r.left - r.width/2) * .18;
    m.ty = (e.clientY - r.top - r.height/2) * .26;
  });
  m.el.addEventListener("pointerleave", function(){ m.tx = 0; m.ty = 0; });
});
var tilts = fine ? [].slice.call(document.querySelectorAll(".tilt")).map(function(el){
  return {el:el,rx:0,ry:0,trx:0,try_:0}; }) : [];
tilts.forEach(function(t){
  t.el.addEventListener("pointermove", function(e){
    var r = t.el.getBoundingClientRect();
    t.try_ = ((e.clientX - r.left)/r.width - .5) * 6;
    t.trx = (.5 - (e.clientY - r.top)/r.height) * 4.5;
  });
  t.el.addEventListener("pointerleave", function(){ t.trx = 0; t.try_ = 0; });
});
(function frame(){
  if(!RM){
    mags.forEach(function(m){
      m.x = lerp(m.x,m.tx,.13); m.y = lerp(m.y,m.ty,.13);
      m.el.style.transform = "translate3d("+m.x.toFixed(2)+"px,"+m.y.toFixed(2)+"px,0)";
    });
    tilts.forEach(function(t){
      t.rx = lerp(t.rx,t.trx,.08); t.ry = lerp(t.ry,t.try_,.08);
      t.el.style.transform = "perspective(1100px) rotateX("+t.rx.toFixed(3)+"deg) rotateY("+t.ry.toFixed(3)+"deg)";
    });
  }
  requestAnimationFrame(frame);
function closeDrops(){
  document.querySelectorAll(".drop.open").forEach(function(d){ d.classList.remove("open"); });
  document.querySelectorAll('.menu button[aria-expanded="true"]').forEach(function(b){ b.setAttribute("aria-expanded","false"); });
}
document.querySelectorAll(".menu button[aria-controls]").forEach(function(btn){
  var panel = document.getElementById(btn.getAttribute("aria-controls"));
  btn.addEventListener("click", function(e){
    e.preventDefault();
    var open = btn.getAttribute("aria-expanded") === "true";
    closeDrops();
    if(!open){ panel.classList.add("open"); btn.setAttribute("aria-expanded","true"); }
  });
});
addEventListener("keydown", function(e){ if(e.key === "Escape"){ closeDrops(); closeSheet(); } });
addEventListener("click", function(e){ if(!e.target.closest(".menu-item")) closeDrops(); });
var burger = document.getElementById("burger"), sheet = document.getElementById("sheet");
var sLinks = [].slice.call(sheet.querySelectorAll(".grouped a"));
sLinks.forEach(function(a,i){ a.style.transitionDelay = (.1 + i*.035) + "s"; });
function closeSheet(){
  sheet.classList.remove("on"); burger.classList.remove("on");
  burger.setAttribute("aria-expanded","false"); document.body.style.overflow = "";
}
burger.addEventListener("click", function(){
  var on = sheet.classList.toggle("on");
  burger.classList.toggle("on", on);
  burger.setAttribute("aria-expanded", String(on));
  document.body.style.overflow = on ? "hidden" : "";
});
sheet.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeSheet); });
var warp = document.getElementById("warp");
document.querySelectorAll('a[href^="#"]:not(#skipIntro)').forEach(function(a){
  a.addEventListener("click", function(e){
    var id = a.getAttribute("href");
    if(id === "#") return;
    var t = document.querySelector(id);
    if(!t) return;
    e.preventDefault();
    var dist = Math.abs(t.getBoundingClientRect().top);
    if(dist > innerHeight*.6){
      warp.classList.remove("go"); void warp.offsetWidth; warp.classList.add("go");
      setTimeout(function(){ warp.classList.remove("go"); }, 1250);
    }
    if(window.lenis){ window.lenis.scrollTo(t, {offset:0, duration:1.1}); }
    else if(RM){ window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY); }
    else {
      var start = window.scrollY;
      var end = t.getBoundingClientRect().top + start;
      var d = Math.min(1300, 400 + Math.abs(end-start)*.38), t0 = performance.now();
      (function step(now){
        var p = Math.min((now-t0)/d,1);
        var e2 = p < .5 ? 8*p*p*p*p : 1 - Math.pow(-2*p+2,4)/2;
        window.scrollTo(0, start + (end-start)*e2);
        if(p<1) requestAnimationFrame(step);
      })(t0);
    }
  });
});
var cio = new IntersectionObserver(function(en){
  en.forEach(function(x){
    if(!x.isIntersecting) return;
    cio.unobserve(x.target);
    var el = x.target, target = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
    if(RM){ el.textContent = target + suf; return; }
    var t0 = performance.now();
    (function step(now){
      var p = Math.min((now-t0)/1700,1), e = p === 1 ? 1 : 1 - Math.pow(2,-11*p);
      el.textContent = Math.round(target*e) + suf;
      if(p<1) requestAnimationFrame(step);
    })(t0);
  });
}, {threshold:.5});
document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });
var tabs = [].slice.call(document.querySelectorAll(".seg [data-tab]"));
var panes = [].slice.call(document.querySelectorAll("[data-pane]"));
var segbar = document.getElementById("segbar");
function moveSeg(b){
  if(innerWidth <= 720) return;
  segbar.style.width = b.offsetWidth+"px";
  segbar.style.transform = "translateX("+b.offsetLeft+"px)";
}
tabs.forEach(function(t){
  t.addEventListener("click", function(){
    tabs.forEach(function(x){ x.setAttribute("aria-selected","false"); });
    t.setAttribute("aria-selected","true");
    panes.forEach(function(p){ p.hidden = p.dataset.pane !== t.dataset.tab; });
    moveSeg(t);
  });
});
addEventListener("load", function(){ moveSeg(tabs[0]); });
addEventListener("resize", function(){
  var c = document.querySelector('.seg [aria-selected="true"]'); if(c) moveSeg(c);
}, {passive:true});
setTimeout(function(){ moveSeg(tabs[0]); }, 240);
document.querySelectorAll(".btn").forEach(function(b){
  b.addEventListener("pointerdown", function(e){
    if(RM) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width,r.height);
    var d = document.createElement("span");
    d.className = "ripple";
    d.style.cssText = "width:"+s+"px;height:"+s+"px;left:"+(e.clientX-r.left-s/2)+"px;top:"+(e.clientY-r.top-s/2)+"px";
    b.appendChild(d);
    setTimeout(function(){ d.remove(); }, 850);
  });
});
var GAL = [
  ["1745327883508-b6cd32e5dde5","Table 03 · Swedish, 90 min","A therapist working along a client's back"],
  ["1745894118353-88e64617e064","Cabin 01 · 190°","The wood-lined interior of a sauna cabin"],
  ["1521146490572-acf652a27fb9","Fuel Lab · The Rebuild","A hand holding a freshly blended smoothie"],
  ["1761035190790-aa1a3472f7fc","Studio B · Slow flow","People practicing yoga together in a studio"],
  ["1532764587009-4d6bb8cf62cd","Quiet hours, 6–8a","A person resting with eyes closed in warm sunlight"],
  ["1515377905703-c4788e51af15","Warm oil, unscented","A dropper bottle of massage oil"],
  ["1696841212541-449ca29397cc","Hot stone add-on","Warm stones resting along a person's back"],
  ["1741552205317-817c8c9a4016","Morning light, west wall","Sunlight streaming through a curtained window"],
  ["1717356495389-6ab1e5ff9d84","Cabin 02 · Low bench","A wooden room with a bench and a single light"],
  ["1730207375825-d734728f877e","Lockers · Phones stay here","A row of metal lockers"]
];
var galRun = document.getElementById("galRun");
if(galRun){
  var frag = document.createDocumentFragment();
  for(var pass = 0; pass < 2; pass++){
    GAL.forEach(function(g){
      var f = document.createElement("figure");
      f.className = "tile";
      if(pass === 1) f.setAttribute("aria-hidden","true");
      f.innerHTML =
        '<div class="duo"><img class="shot" src="https://images.unsplash.com/photo-' + g[0] +
        '?fm=jpg&amp;q=76&amp;w=760&amp;auto=format&amp;fit=crop" alt="' + (pass === 0 ? g[2] : "") +
        '" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
        '<span class="tone"></span><span class="lift"></span></div>' +
        '<span class="shade"></span><figcaption class="cap">' + g[1] + '</figcaption>';
      frag.appendChild(f);
    });
  }
  galRun.appendChild(frag);
}
document.addEventListener("error", function(e){
  var img = e.target;
  if(!img || img.tagName !== "IMG") return;
  if(!/images\.unsplash\.com/.test(img.currentSrc || img.src || "")) return;
  img.style.opacity = "0";
  var host = img.closest(".duo") || img.closest(".stage-bg") || img.closest(".bg");
  if(host){ var t = host.querySelector(".tone"); if(t) t.style.opacity = ".12"; }
}, true);
var tnum = document.getElementById("tnum"), tbar = document.getElementById("tbar");
var stageEls = [].slice.call(document.querySelectorAll("#stages li"));
var verdict = document.getElementById("verdict"), tot = document.getElementById("tot");
var timers = [], raf = null;
function clearAll(){ timers.forEach(clearTimeout); timers = []; if(raf) cancelAnimationFrame(raf); }
function at(fn,ms){ timers.push(setTimeout(fn,ms)); }
function reset(){
  clearAll();
  tnum.textContent = "82";
  tbar.style.transition = "none"; tbar.style.transform = "scaleX(1)";
  stageEls.forEach(function(li){ li.classList.remove("done"); li.querySelector(".dur").textContent = ""; });
  verdict.classList.remove("on");
}
function runProtocol(){
  reset();
  if(RM){
    tnum.textContent = "11"; tbar.style.transform = "scaleX(.11)";
    stageEls.forEach(function(li){ li.classList.add("done"); li.querySelector(".dur").textContent = li.dataset.dur; });
    verdict.classList.add("on"); return;
  }
  at(function(){
    tbar.style.transition = "transform 4.4s cubic-bezier(.76,0,.24,1)";
    tbar.style.transform = "scaleX(.11)";
    var t0 = performance.now();
    (function step(now){
      var p = Math.min((now-t0)/4400,1), e = p === 1 ? 1 : 1 - Math.pow(2,-10*p);
      tnum.textContent = Math.round(82 + (11-82)*e);
      if(p<1) raf = requestAnimationFrame(step);
    })(t0);
  }, 460);
  stageEls.forEach(function(li,i){
    at(function(){ li.classList.add("done"); li.querySelector(".dur").textContent = li.dataset.dur; }, 860 + i*920);
  });
  at(function(){ tot.textContent = "90 min"; verdict.classList.add("on"); }, 860 + stageEls.length*920 + 360);
  at(runProtocol, 10200);
}
var pio = new IntersectionObserver(function(en){
  en.forEach(function(x){ if(x.isIntersecting) runProtocol(); else clearAll(); });
}, {threshold:.2});
pio.observe(document.getElementById("proto"));
})();
/* ============================================================================
   scroll-scenes.js — GSAP ScrollTrigger + Lenis scroll-scene layer
   ----------------------------------------------------------------------------
   Mechanics (reference: shaker.fitness):
     1  Full-page background that tweens continuously between scenes' data-bg
     2  Ink inversion driven from each scene's data-ink
     3  Chained/masked ticker headlines (masked reveal — see design-audit.md §8)
     4  Persistent pinned hero object (the IN/TENSION mark), variants crossfade
     5  Snap to scene tops (desktop only; disabled < 768px and under RM)
     6  Intro sequence with skip link + sessionStorage flag
     7  Minimal chrome lives in the stylesheet (transparent nav, outline CTAs)
   Hard rules honoured here:
     - Only transform / opacity / background-color are animated.
     - No CSS rule hides content by default; every hidden pose is applied by
       GSAP at runtime, so the page is fully readable with JS disabled.
     - No-ops completely when GSAP/ScrollTrigger/Lenis are absent (jsdom).
   ========================================================================== */

  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var scenes = document.querySelectorAll(".scene");
  if (!scenes.length) return;
  /* signal to CSS that JS is live (reveals the pinned object) */
  document.documentElement.classList.add("js");
  if (!hasLibs) return; // no GSAP/Lenis: content stays fully visible
  var bg = document.getElementById("bg-canvas");
  var obj = document.getElementById("hero-object");
  var sceneRun = document.querySelector(".scene-run");
  var skip = document.getElementById("skipIntro");
  var root = document.documentElement;
  var first = scenes[0];
  var firstWords = first.querySelectorAll(".ticker .word");
  var SESSION_KEY = "inTENSION-intro-seen";
  var introSeen = false;
  try { introSeen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) {}
  /* initial paint: scene 1 owns the canvas and the ink */
  if (bg) bg.style.backgroundColor = first.dataset.bg;
  root.dataset.ink = first.dataset.ink;
  /* ── Reduced motion: no lenis, no snap, no pin, no scrubbed transforms ────
     Background simply follows the active scene through the CSS transition. */
  if (RM) {
    if (bg) bg.style.transition = "background-color .45s ease";
    Array.prototype.forEach.call(scenes, function (scene) {
      ScrollTrigger.create({
        trigger: scene,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: function (self) {
          if (!self.isActive) return;
          if (bg) bg.style.backgroundColor = scene.dataset.bg;
          root.dataset.ink = scene.dataset.ink;
        }
      });
    });
    return;
  }
  /* ── Lenis wired into GSAP's ticker: one clock for scroll + tweens ────── */
  var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  window.lenis = lenis; // the inline script's anchor handler routes through it
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  /* ── Mechanic 1 — continuous background interpolation ──────────────────── */
  Array.prototype.forEach.call(scenes, function (scene, i) {
    var next = scenes[i + 1];
    if (!next) return;
    gsap.fromTo(
      bg,
      { backgroundColor: scene.dataset.bg },
      {
        backgroundColor: next.dataset.bg,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true }
      }
    );
  });
  /* ── Mechanic 2 — ink inversion at the luminance midpoint ──────────────── */
  Array.prototype.forEach.call(scenes, function (scene) {
    ScrollTrigger.create({
      trigger: scene,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: function (self) {
        if (self.isActive) root.dataset.ink = scene.dataset.ink;
      }
    });
  });
  /* ── Mechanic 3 — masked ticker headline reveals ─────────────────────────
     The intro timeline owns scene 0 on first visit; every other scene (and
     scene 0 on return visits) reveals through the scroll trigger. */
  Array.prototype.forEach.call(scenes, function (scene, i) {
    var words = scene.querySelectorAll(".ticker .word");
    if (!words.length) return;
    if (i === 0 && !introSeen) return;
    gsap.from(words, {
      yPercent: 115,
      duration: 1.05,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: scene, start: "top 65%" }
    });
  });
  /* ── Mechanic 4 — persistent pinned hero object ──────────────────────────
     One mark, two variants (gradient ↔ ink outline), fixed in the viewport
     across the whole run (CSS position:fixed — functionally the same as
     ScrollTrigger pin:pinSpacing:false but without the pin-spacer math that
     breaks scrolling when the pinned element is an absolute overlay; verified
     empirically). Variants crossfade with a y-offset + 1–3° rotation per
     transition and the object alternates left/right so the headline owns the
     other side. It fades out once the footer takes over. */
  var objInner = null;
  var variants = null;
  if (obj) {
    objInner = obj.querySelector(".obj-inner");
    variants = obj.querySelectorAll(".variant");
  }
  if (obj && objInner && variants.length === 2) {
    gsap.set(variants[1], { opacity: 0 });
    var sideX = function () {
      var left = parseFloat(window.getComputedStyle(obj).left) || 0;
      return Math.max(0, window.innerWidth - obj.offsetWidth - left * 2);
    };
    var curSide = 0;
    Array.prototype.forEach.call(scenes, function (scene, i) {
      var next = scenes[i + 1];
      if (!next) return;
      var cur = i % 2; // variant visible while scene i owns the middle
      gsap.timeline({
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true }
      })
        .to(variants[cur],     { opacity: 0, y: -40, rotate: -2, ease: "none" }, 0)
        .to(variants[1 - cur], { opacity: 1, y: 0,   rotate: 0,  ease: "none" }, 0);
    });
    Array.prototype.forEach.call(scenes, function (scene, i) {
      ScrollTrigger.create({
        trigger: scene,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: function (self) {
          if (!self.isActive) return;
          curSide = i % 2;
          gsap.to(obj, { x: curSide ? sideX() : 0, duration: 0.7, ease: "power2.out", overwrite: "auto" });
        }
      });
    });
    /* fade the mark out once the footer owns the screen */
    var footerEl = document.querySelector("footer");
    if (footerEl) {
      ScrollTrigger.create({
        trigger: footerEl,
        start: "top 90%",
        onEnter: function () { gsap.to(obj, { opacity: 0, duration: 0.4, ease: "power2.out" }); },
        onLeaveBack: function () { gsap.to(obj, { opacity: 1, duration: 0.4, ease: "power2.out" }); }
      });
    }
    window.addEventListener("resize", function () {
      if (curSide) gsap.set(obj, { x: sideX() });
    }, { passive: true });
  }
  /* ── HERO VEIL — the changing colour layered over the massage images ─────
     Purple at the top, scrubbed to white over the first swipe (until the
     half-hold), then back to purple over the second swipe — the full
     purple→white→purple arc the client specified, painted on top of the
     photos. Page two's own background scrubs white→purple in lock-step
     (see below), so the whole opening hands the screen over to page three
     with no hard seam. */
  /* ── floating item (hero object) — hidden until the purple page has been ──
     swiped up (fades in as #trust rises, fades back out on scroll-up). */
  if (obj && scenes[2]) {
    gsap.set(obj, { opacity: 0 });
    gsap.fromTo(obj, { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: scenes[2], start: "top bottom", end: "top top", scrub: true }
    });
  }
  /* veil: purple base + a white crossfade layer — opacity-only scrubs
     (compositor-friendly; no per-frame background repaint = no jitter) */
  var veilEl = document.getElementById("heroVeil");
  var veilW = document.getElementById("heroVeilW");
  if (veilW && scenes[1]) {
    gsap.fromTo(veilW, { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: scenes[1], start: "top bottom", end: "top 50%", scrub: true }
    });
  }
  var trustPanel = document.querySelector(".panel--cover");
  var holdTint = document.getElementById("holdTint");
  if (trustPanel && scenes[2]) {
    if (veilW) {
      gsap.fromTo(veilW, { opacity: 1 }, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: trustPanel, start: "top bottom", end: "top top", scrub: true }
      });
    }
    if (holdTint) {
      gsap.fromTo(holdTint, { opacity: 0 }, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: trustPanel, start: "top bottom", end: "top top", scrub: true }
      });
    }
  }
  var holdPanel = document.querySelector(".panel--hold");
  if (holdPanel) {
    gsap.from(holdPanel.querySelectorAll("h1, .hero-sub, .cta-row"), {
      y: 24, autoAlpha: 0, duration: 0.7, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: holdPanel, start: "top bottom", end: "top 50%" }
    });
  }
  /* ── SECOND SWIPE — the purple page (70% transparent) slides up; the veil's
     white layer fades out (purple returns over the photos) and the glass hold
     picks up a matching purple tint, all via compositor-friendly opacity. */
  /* ── Mechanic 5 — snap to scene tops (desktop only) ──────────────────────
     Snap targets are computed per scene (scenes may outgrow 100svh on short
     viewports), which degenerates to the reference's even 1/(n-1) spacing on
     uniform pages. Disabled under 768px — it fights touch momentum. */
  var snapST = null;
  var snapPts = [];
  /* Layout tops. The sticky panels report their *stuck* position through
     offsetTop/rect while pinned, so their true layout tops are cached once at
     scroll 0 (they can only change when the dismissible promo bar collapses —
     see the MutationObserver below). Other scenes are measured live. The
     half-hold panel's resting position is its layout top minus half a viewport. */
  var panelDocs = {};
  var calcSnapPts = function () {
    var sy = window.scrollY;
    snapPts = Array.prototype.map.call(scenes, function (s) {
      if (s.classList.contains("panel--base") || s.classList.contains("panel--hold")) {
        var key = s.id;
        if (panelDocs[key] === undefined) panelDocs[key] = s.getBoundingClientRect().top + sy;
        var top = panelDocs[key];
        return s.classList.contains("panel--hold") ? top - window.innerHeight / 2 : top;
      }
      return s.getBoundingClientRect().top + sy;
    });
  };
  var barEl = document.getElementById("bar");
  if (barEl && "MutationObserver" in window) {
    var barObs = new MutationObserver(function () {
      if (!barEl.classList.contains("gone")) return;
      panelDocs = {};          // the page shifts up — recompute from scratch
      calcSnapPts();
      ScrollTrigger.refresh();
      barObs.disconnect();
    });
    barObs.observe(barEl, { attributes: true, attributeFilter: ["class"] });
  }
  var createSnap = function () {
    if (snapST || !sceneRun) return;
    calcSnapPts();
    snapST = ScrollTrigger.create({
      snap: {
        /* ScrollTrigger passes progress (0–1) here, not pixels — convert via
           the trigger's own start/end, find the nearest scene top, convert
           back. (Defensive: also accept raw pixels if a caller passes them.) */
        snapTo: function (v, self) {
          var start = self.start, range = (self.end - self.start) || 1;
          var px = (v <= 1 && v >= 0) ? start + v * range : v;
          var best = snapPts[0], bd = Infinity, k;
          for (k = 0; k < snapPts.length; k++) {
            var d = Math.abs(snapPts[k] - px);
            if (d < bd) { bd = d; best = snapPts[k]; }
          }
          return (best - start) / range;
        },
        duration: { min: 0.2, max: 0.5 },
        delay: 0.08,
        ease: "power2.inOut"
      },
      trigger: sceneRun,
      start: "top top",
      end: "bottom bottom"
    });
  };
  var killSnap = function () {
    if (snapST) { snapST.kill(); snapST = null; }
  };
  if (window.innerWidth >= 768) createSnap();
  /* ── Mechanic 6 — intro sequence with skip ─────────────────────────────── */
  var clearWill = function () {
    if (bg) bg.style.willChange = "auto";
    if (obj) obj.style.willChange = "auto";
  };
  var finishIntro = function () {
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    if (skip) {
      skip.classList.remove("show");
      skip.setAttribute("aria-hidden", "true");
    }
    /* render safety: never leave the first-page logo hidden */
    if (first) gsap.set(first.querySelectorAll("#hero .logo-lg"), { autoAlpha: 1 });
    clearWill();
    ScrollTrigger.refresh();
  };
  if (!introSeen) {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    var intro = gsap.timeline({ paused: true, onComplete: finishIntro });
    intro
      .from(first.querySelectorAll("#hero .logo-lg"), {
        y: 26, autoAlpha: 0, duration: 0.8, ease: "power2.out"
      }, 0.2)
      .add(finishIntro, "+=0.15");
    if (skip) {
      skip.classList.add("show");
      skip.setAttribute("aria-hidden", "false");
      skip.addEventListener("click", function (e) {
        e.preventDefault();
        intro.progress(1); // jumps the timeline to its end
      });
    }
    intro.play();
  } else {
    /* return visit: intro skipped, object starts settled, logo always visible */
    if (objInner) gsap.set(objInner, { y: 0, rotate: 0, opacity: 1 });
    if (obj) gsap.set(obj, { opacity: 1 });
    if (first) gsap.set(first.querySelectorAll("#hero .logo-lg"), { autoAlpha: 1 });
    clearWill();
  }
  /* ── refresh: after webfonts (none here) and on debounced resize ───────── */
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (window.innerWidth >= 768) { createSnap(); calcSnapPts(); }
      else { killSnap(); }
      ScrollTrigger.refresh();
    }, 200);
  }, { passive: true });
  window.addEventListener("load", function () {
    calcSnapPts();
    ScrollTrigger.refresh();
  });

}
