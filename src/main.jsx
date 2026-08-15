import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initEffects } from './effects.js';

// No StrictMode: the scroll layer (GSAP/ScrollTrigger/Lenis) is wired
// imperatively ONCE here, outside React — calling it from a React effect
// let React's passive-effect machinery re-invoke it (mount replay), which
// re-appended the gallery marquee tiles every frame.
// Remove the static boot layer — the app's own purple preloader replaces it.
document.getElementById('boot')?.remove();
createRoot(document.getElementById('root')).render(<App />);
// initEffects needs the committed DOM, so defer one tick past React's commit.
setTimeout(initEffects, 0);
