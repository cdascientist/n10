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
(function () {
  "use strict";

  var hasLibs = !!(window.gsap && window.ScrollTrigger && window.Lenis);
  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var scenes = document.querySelectorAll(".scene");
  if (!scenes.length) return;

  /* signal to CSS that JS is live (reveals the pinned object) */
  document.documentElement.classList.add("js");

  if (!hasLibs) return; // no GSAP/Lenis: content stays fully visible

  gsap.registerPlugin(ScrollTrigger);

  var bg = document.getElementById("bg-canvas");
  var obj = document.getElementById("hero-object");
  var run = document.querySelector(".scene-run");
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
          gsap.to(obj, { x: curSide ? sideX() : 0, duration: 0.7, ease: "power2.out", overwrite: true });
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
     half-hold), back on reverse. Page two is opaque white, so the white veil
     hands the screen over seamlessly; page three (purple) then slides in and
     the canvas tween white→purple completes the arc. */
  var veilEl = document.getElementById("heroVeil");
  if (veilEl && scenes[1]) {
    gsap.fromTo(veilEl,
      { backgroundColor: "#8B2BFF" },
      {
        backgroundColor: "#FFFFFF", ease: "none", immediateRender: false,
        scrollTrigger: { trigger: scenes[1], start: "top bottom", end: "top 50%", scrub: true }
      }
    );
  }

  /* page 2 (the half-hold) content reveals as it slides in */
  var holdPanel = document.querySelector(".panel--hold");
  if (holdPanel) {
    gsap.from(holdPanel.querySelectorAll("h1, .hero-sub, .cta-row"), {
      y: 24, autoAlpha: 0, duration: 0.7, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: holdPanel, start: "top bottom", end: "top 50%" }
    });
  }

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
    if (snapST || !run) return;
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
      trigger: run,
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
      .from(objInner, { y: 26, rotate: 3, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0.35)
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
    /* return visit: intro skipped, object starts settled */
    if (objInner) gsap.set(objInner, { y: 0, rotate: 0, opacity: 1 });
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
})();
