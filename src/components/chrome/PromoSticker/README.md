# PromoSticker

The fixed bottom-right promo badge (`#sticker`). Copy is driven by the
`STICKER_COPY` constants in effects.js; the text below is the no-JS
fallback. `pointer-events:none` — pure signage, never blocks clicks.
Springs in when `reveal()` fires, then idles on a slow float.

**Used by:** App (src/App.jsx) — fourth top-level sibling, after
Preloader.

**Contains:** `#sticker` > `.st-in` > `.st-dot` + `.st-txt`
(`.st-word` NEW / `.st-sub` FOUNDING MEMBERS).

## Modify
- Change the fallback badge copy → `index.jsx`.
- Change the live copy / float animation → effects.js (`STICKER_COPY`).
