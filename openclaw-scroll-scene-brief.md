# openclaw-scroll-scene-brief.md — IN/TENSION scroll-scene conversion

Working directory: `/root/n10` (live nginx root `/var/n10`). Branch: `scroll-scenes`.
This file holds the original conversion brief plus the Mechanic 8 addendum.

---

# BRIEF: Convert the current site to a scroll-scene experience

Reference implementation: `https://shaker.fitness/`
You are adding a **motion and staging layer** to the site already in your working
directory. Match the reference's *mechanics* exactly. Do **not** match its colors,
typography, copy, or subject matter — those come from the existing site.

## 0. Do this first (discovery)

Before writing any code, inventory the current site and write your findings to
`design-audit.md` in the project root:

1. **Entry file** — the main HTML/JSX/template that renders the page.
2. **Section list** — every top-level content section, in DOM order, with its
   heading text and its CTA (if any).
3. **Palette** — every distinct background and brand color currently in use.
   Pull from CSS custom properties first, then hardcoded hex/rgb/hsl values,
   then Tailwind config if present. Record each as hex.
4. **Hero object** — is there a repeating product shot, illustration, logo mark,
   device mockup, or icon that appears in more than one section? Name it. If
   there is none, say so explicitly — Mechanic 5 changes if so.
5. **Typography** — display face, body face, and the largest heading size in use.
6. **Stack** — vanilla / React / Vue / Astro / WordPress / etc., and the
   bundler. This determines how you register ScrollTrigger.

**Stop and report the audit before proceeding to Section 2.** I want to confirm
the scene count and palette mapping before you touch the markup.

## 1. Hard rules

- **Do not rewrite copy.** Headlines, body text, CTA labels, and alt text stay
  exactly as they are. You are restaging existing content, not authoring new
  content.
- **Do not change the palette.** Every color you animate must already exist in
  the audit from step 0. If you need an intermediate value, interpolate between
  two existing colors — never introduce a new hue.
- **Do not change information architecture.** Same sections, same order, same
  links, same destinations.
- **Do not add a library that isn't listed in Section 2.**
- The site must remain fully functional with JavaScript disabled: all content
  present, all links clickable, nothing stuck at `opacity: 0`.
- Work on a branch. Do not commit to main.

## 2. Dependencies

Exactly these, nothing else:

```
gsap                 ^3.12   (core + ScrollTrigger)
lenis                ^1.1    (smooth scroll)
```

Load ScrollTrigger via `gsap.registerPlugin(ScrollTrigger)`. If the project has
no bundler, use the CDN builds and a single `<script defer>` at the end of body.

Wire Lenis into GSAP's ticker so scroll position and tweens share one clock —
this is required, not optional. Without it the background tween stutters:

```js
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

## 3. Structure: scenes

Convert each top-level section into a **scene**. A scene is:

- Exactly `100svh` tall (use `svh`, not `vh` — mobile browser chrome will break
  `vh`). Fall back to `100vh` for older browsers via a preceding declaration.
- `position: relative`, `display: grid`, content vertically centered.
- Carries a `data-bg` attribute holding the hex color that scene owns.
- Carries a `data-ink` attribute: `light` or `dark`, whichever gives WCAG AA
  contrast against that scene's `data-bg`. Compute this, don't guess.

```html
<section class="scene" data-bg="#0F4C81" data-ink="light"> ... </section>
```

Content inside a scene is deliberately sparse — this is the reference's defining
restraint. Per scene, at most:

- one headline block
- one paragraph of ~4 lines
- one CTA
- one visual

If an existing section carries more than that, split it into two scenes rather
than compressing it. Never delete content to make it fit.

Set `background-color: transparent` on every scene. **The scenes never paint
their own background** — that's the job of Mechanic 1.

## 4. The seven mechanics

Implement all seven. These are the "exact similarities" — the parts that must
match the reference.

### Mechanic 1 — Full-page background that tweens (the signature)

One persistent full-viewport background layer sits behind everything:

```css
#bg-canvas { position: fixed; inset: 0; z-index: -1; will-change: background-color; }
```

Its color is driven by scroll position and interpolates continuously between
adjacent scenes' `data-bg` values. `ease: 'none'` and `scrub: true` both required.

### Mechanic 2 — Ink inversion

Text, nav, and CTA colors flip between light and dark as the background crosses
the luminance midpoint. Drive it from `data-ink`, transitioned on the root.

### Mechanic 3 — Chained word ticker headlines

Two-word pairs per headline; if the existing headlines don't chain naturally,
fall back to a straight masked reveal rather than inventing new words.

### Mechanic 4 — Persistent pinned object

One element, pinned across the scene sequence, that transforms rather than gets
replaced. If step 0 found no repeating object, skip this mechanic and use
scrub-linked per-scene parallax instead.

### Mechanic 5 — Snap

Scroll must settle on a scene. Never park mid-transition. Disable under 768px.

### Mechanic 6 — Intro sequence with a skip

~1.6–2.2s intro, `sessionStorage` flag, "Skip animation" link, body
`overflow: hidden` during.

### Mechanic 7 — Minimal chrome

Nav fixed/transparent ink-driven; one outline CTA per scene; remove progress
bars, dividers, decorative gradients, badges.

## 5. Easing and timing constants

| Purpose | Value |
|---|---|
| All scrubbed / scroll-linked motion | `ease: 'none'` |
| Text reveals | `power3.out`, 0.9–1.1s |
| Object settles | `power2.out`, 0.7s |
| Snap | `power2.inOut` |
| Ink color transition | CSS `ease`, 450ms |
| Stagger between lines | 0.06–0.10s |

## 6. Accessibility and performance floor

- `prefers-reduced-motion: reduce` → skip intro, disable snap/pinning, drop
  scrubbed transforms, plain 450ms CSS transition on scene enter.
- Keyboard tab order walks the page in DOM order; visible focus rings.
- Only animate `transform`, `opacity`, and `background-color`.
- `will-change` only on `#bg-canvas` and the pinned object; removed after intro.
- `ScrollTrigger.refresh()` after webfonts load and on resize (debounced 200ms).
- No layout shift after load; 60fps on a mid-tier laptop.

## 7. Acceptance checklist

(Background interpolation, palette trace, copy preservation, AA ink, object
never pops, snap settles, skip link works, RM pass, JS-disabled pass, 375px
pass, keyboard pass — see `design-audit.md` / `changelog-scroll-scenes.md` for
the full state and verification results.)

## 8. Deliverables

1. `design-audit.md` — inventory + proposed headline chain + scene→color mapping.
2. The implemented branch.
3. A short changelog listing every file touched and why.
4. Before/after screenshots at 1440px and 375px.

---

# ADDENDUM: Mechanic 8 — Scroll-cover panel transition

Attached to this brief. Same working directory, same branch, same hard rules
from Section 1 (no copy changes, no new colors, no IA changes, must survive
JS-disabled).

Reference behavior: `https://sly.systems/` — the first-to-second-page transition.

**Read Section 5 of this document before writing any code.** This mechanic
conflicts with three mechanics in the original brief and the reconciliation is
not optional.

## 1. The effect, precisely

Panel one stays fixed in the viewport. Panel two rises from the bottom edge and
slides up **over** it, covering it completely, moving 1:1 with scroll. Panel one
does not scroll away — it is occluded in place.

The critical detail people get wrong: **panel two moves at scroll speed while
panel one does not move at all.** The relative motion is what reads as "sliding
over." If panel one also translates, the effect collapses into an ordinary
scroll and the whole thing is wasted.

Panel two must be fully opaque. Any transparency and the illusion dies instantly.

## 2. Discovery (do this first)

Append to `design-audit.md`:

1. Which two sections are panel one and panel two. Default: the hero and the
   section immediately after it.
2. Whether the stack continues — is this one cover, or does panel three cover
   panel two as well? Report your recommendation. Two or three covers maximum.
3. **Sticky-blocker audit.** Walk every ancestor of the panel container up to
   `<body>` and flag any element carrying `transform`, `filter`, `perspective`,
   `backdrop-filter`, `will-change: transform`, `contain: paint`, or
   `overflow: hidden`/`clip`/`auto`. Each of these silently breaks
   `position: sticky` on descendants. List every blocker you find and how you
   intend to remove or relocate it.
4. The opaque background color panel two will carry — from the existing palette
   only.

Report before proceeding.

## 3. Baseline implementation (CSS only)

```html
<div class="cover-stack">
  <section class="panel panel--base"> <div class="panel__inner"> …panel one… </div> </section>
  <section class="panel panel--cover"> <div class="panel__inner"> …panel two… </div> </section>
</div>
```

```css
.cover-stack { position: relative; /* no overflow, no transform, no filter */ }
.panel--base  { position: sticky; top: 0; height: 100svh; z-index: 1; overflow: hidden; }
.panel--cover { position: relative; z-index: 2; min-height: 100svh;
                background-color: var(--panel-cover-bg); /* MUST be fully opaque */
                will-change: transform; }
```

That is the entire effect. Do not reach for `position: fixed` on the base panel.

## 4. Polish layer (GSAP, scrubbed)

Every tween here is `ease: 'none'` and `scrub: true`.

- **4a. Outgoing panel treatment** — panel one recedes as covered: `.panel--base .panel__inner` → `scale 0.94, y -48, opacity 0.4`. Ceilings: scale 0.90, y -80px, opacity floor 0.3. Animate `.panel__inner`, never `.panel--base`.
- **4b. Leading-edge treatment** — cover's top corners `borderTopLeftRadius/borderTopRightRadius 32 → 0` scrubbed; `box-shadow: 0 -32px 64px -16px rgba(0,0,0,.28)` (match the site's elevation language; hairline in `--ink-dim` if the site uses no shadows).
- **4c. Content lag (optional)** — `.panel--cover .panel__inner` `y: 60` scrubbed, keep < 80px.

## 5. Reconciling with the original brief (not optional)

- **5a. Mechanic 1** — suppress the global background tween across the covered
  pair: skip pairs where `next.dataset.cover === 'true'`; set `#bg-canvas` to
  the cover's `data-bg` instantly on land (`onEnter`/`onLeaveBack`). A
  transition is either a color tween or a cover — never both.
- **5b. Mechanic 4** — the pinned hero object must not span the cover; end it
  at the base panel's boundary. If it should carry through, duplicate inside
  the cover and crossfade.
- **5c. Mechanic 5** — add the landed position as a snap target; verify that
  scrolling to 50% of the transition and releasing resolves fully covered or
  fully uncovered, never in between.
- **5d. Mechanic 2** — verify the ink flip fires on the cover panel's
  `data-ink`, not the base's, once the cover crosses midpoint.

## 6. Failure modes to check for

Sticky broken by ancestor (rerun audit) · cover transparent (opaque bg) ·
cover slides under base (z-index) · judder (transform/opacity/radius only) ·
iOS Safari (svh, no ancestor filter) · transition length (fixed at one viewport;
lengthen with an internal spacer, not trigger changes) · clipped base content
(min-height + drop overflow:hidden).

## 7. Reduced motion

- **Keep the sticky cover** (scroll position, not animation).
- Drop 4a entirely; drop 4c. Keep 4b's static rounded corners but do not
  animate the radius.

## 8. Acceptance checklist

- [ ] Panel one holds absolutely still during the entire cover.
- [ ] Panel two moves exactly 1:1 with scroll.
- [ ] Panel one is 100% occluded when the cover lands.
- [ ] Reverse scroll is symmetrical.
- [ ] Scroll cannot rest mid-transition on desktop.
- [ ] No transition runs both a background tween and a cover (5a).
- [ ] Sticky verified on iOS Safari and Chrome Android on real viewport heights.
- [ ] Pinned hero object releases before the cover lands (5b).
- [ ] Reduced-motion pass: cover still works, no scale/fade on panel one.
- [ ] JS disabled: both panels present, readable, in order, nothing hidden.
- [ ] 375px: no horizontal overflow, no clipped content in either panel.
- [ ] Keyboard tab order walks panel one then panel two, scrolling each into view.

## 9. Deliverables

1. Updated `design-audit.md` with the sticky-blocker audit and your
   cover-vs-tween assignment for every transition.
2. Implementation on the same branch.
3. A screen recording of the transition scrolling down and back up.
4. Confirmation of iOS Safari testing specifically.
