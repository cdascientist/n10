{/* ════════════════════════════════════════════════════════════
    main.jsx — application entry point
    Renders: mounts <App/> (the composition root from src/App.jsx)
    under #root, then calls initEffects() exactly once to wire the
    imperative scroll/interaction layer (GSAP, ScrollTrigger, Lenis).

    Used-by (breadcrumb up): index.html — this is the module that
    index.html loads as the script entry.

    Contains (breadcrumb down): the React root render (flushSync) +
    the single initEffects() call. The comments below explain why
    StrictMode is absent and why the render is flushed synchronously.
    ════════════════════════════════════════════════════════════ */}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import './index.css';
import App from './App.jsx';
import { initEffects } from './effects.js';

// No StrictMode: the scroll layer (GSAP/ScrollTrigger/Lenis) is wired
// imperatively ONCE here, outside React — calling it from a React effect
// let React's passive-effect machinery re-invoke it (mount replay), which
// re-appended the gallery marquee tiles every frame.
//
// flushSync: React's render() commits asynchronously (scheduler task). On
// slower devices the setTimeout below could fire BEFORE the commit, so
// initEffects would capture null element refs — the preloader would never
// disengage (its reveal bails on the missing element) and every scrub
// would be dead. flushSync makes the commit synchronous so initEffects
// always runs against the committed DOM.
//
// Remove the static boot layer — the app's own purple preloader replaces it.
document.getElementById('boot')?.remove();
const root = createRoot(document.getElementById('root'));
flushSync(() => root.render(<App />));
initEffects();
