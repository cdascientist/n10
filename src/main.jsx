import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// No StrictMode: the scroll layer (GSAP/ScrollTrigger/Lenis) is wired
// imperatively once on mount and double-mounting would double-register it.
createRoot(document.getElementById('root')).render(<App />);
