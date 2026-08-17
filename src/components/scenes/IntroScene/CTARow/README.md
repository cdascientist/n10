# CTARow

The page-2 booking CTA row — the magnified `.btn.mag` "Book a session"
link with its arrow icon (`#i-arrow`).

**Used by:** IntroScene (src/components/scenes/IntroScene/index.jsx) —
second child of `.wrap.scene-in`, after the headline, before the
hero sub-copy.

**Contains:** `div.cta-row` > `a.btn.mag` (text + `svg.arw` > `use#i-arrow`).

## Modify
- Change the CTA copy / href → `index.jsx`.
- Its intro animation (slide/fade) lives in effects.js.
