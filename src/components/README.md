# components — one directory per component

Every meaningful UI block is a component directory:
`<Area>/<Name>/index.jsx` + `README.md`. Sub-parts of a component
live in **subdirectories** of that component (e.g. `Nav/Dropdown/`,
`TrustScene/pills/`), each also with its own `README.md`.

```
components/
├── README.md          ← this file
├── chrome/            ← site chrome (canvas, preloader, nav, sheet, icons, hero object)
├── scenes/            ← one directory per scroll scene (11 scenes, exact DOM order)
└── Footer/            ← the site footer
```

## How to read a component directory
- `index.jsx` — the component. Header comment block explains: what it
  renders · used-by (breadcrumb up, with path) · contains (breadcrumb
  down). Inline `{/* … */}` breadcrumbs mark block boundaries.
- `README.md` — same four facts in prose, plus *how to modify this
  section*.
- Subdirectories — smaller parts the component composes.

## Hard rules
- **DOM contract is sacred.** ids, classNames, `data-*`, SVG symbol
  ids and `<use href>` references must stay byte-identical (effects.js
  and the acceptance suite depend on them). Copy JSX verbatim when
  moving it — including long base64 data URIs.
- Scene order must remain: `hero, intro, trust, treatments, gallery,
  movement, heat, membership, membership-cards, fuel-menu, board, book`.
- `effects.js` and `index.css` stay one file each — never split.
