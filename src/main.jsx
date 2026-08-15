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
