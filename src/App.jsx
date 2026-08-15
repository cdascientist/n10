import { useEffect } from 'react';
import { initEffects } from './effects.js';

// The whole page is one static React tree (same DOM as the original), with all
// scroll/interaction behaviour wired imperatively in effects.js after mount.
export default function App() {
  useEffect(() => { initEffects(); }, []);
  return (
    <>

{/* scroll-scene background canvas (Mechanic 1) — colour is driven by JS */}
<div id="bg-canvas"><span id="bgPurple"></span></div>

{/* intro skip link (Mechanic 6) — shown while the intro timeline runs */}
<a className="skip-intro" id="skipIntro" href="#skipIntro">Skip animation</a>

{/* ═══ PRELOADER — waits for the full load, then fades into the page ═══ */}
<div id="preloader" role="status" aria-label="Loading IN/TENSION">
  <svg className="pl-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
  <span className="pl-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
  <div className="pl-bar" aria-hidden="true"><i></i></div>
  <p className="pl-txt">Preparing your visit</p>
</div>


{/* ═══ PROMO STICKER — fixed bottom-right badge. Copy is driven by the
     STICKER_COPY constants in the script block; the text below is the
     no-JS fallback. It springs in when reveal() fires, then idles on a
     slow float. pointer-events:none — pure signage, never blocks clicks. ═══ */}
<div id="sticker" aria-label="NEW · FOUNDING MEMBERS">
  <span className="st-in">
    <span className="st-dot" aria-hidden="true"></span>
    <span className="st-txt">
      <span className="st-word">NEW</span>
      <span className="st-sub">FOUNDING MEMBERS</span>
    </span>
  </span>
</div>


<div id="warp"><i></i><i></i><i></i><i></i><i></i></div>

{/* ═══ ORIGINAL ICON SET — 24px grid, 1.75 stroke, round caps ═══ */}
<svg style={{display:"none"}} aria-hidden="true">
  <defs>
    <linearGradient id="markG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#C77DFF"/><stop offset=".5" stop-color="#8B2BFF"/><stop offset="1" stop-color="#6E1FD1"/>
    </linearGradient>
  </defs>
  <g id="i-hands" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 15c3-4.5 6.4-6.8 9-6.8s6 2.3 9 6.8"/><path d="M12 8.2V3.4"/><circle cx="12" cy="18.6" r="1.6"/>
  </g>
  <g id="i-heat" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c3.6 0 6.2-2.6 6.2-6 0-4.3-4-6.1-4.6-11-2 1.6-3.3 3.7-3.3 5.8 0 1.6-1 2.3-1.8 1.5-.6-.6-.8-1.6-.8-2.4C6 10.6 5.8 12.6 5.8 15c0 3.4 2.6 6 6.2 6z"/>
  </g>
  <g id="i-cold" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>
    <path d="M9.6 4.6 12 6.9l2.4-2.3M9.6 19.4 12 17.1l2.4 2.3"/>
  </g>
  <g id="i-move" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4.6" r="2"/><path d="M12 7.4v6M12 13.4 8 20M12 13.4 16 20M7 10h10"/>
  </g>
  <g id="i-cup" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.4 7h11.2l-1.1 12.1a2 2 0 0 1-2 1.9H9.5a2 2 0 0 1-2-1.9z"/><path d="M5 7h14"/><path d="M9.5 4c.9-1 2.2-1.2 3-.4.9.8 2.1.6 3-.4"/>
  </g>
  <g id="i-key" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="4"/><path d="M10.9 10.9 20 20M17 17l2.4-2.4M14.2 14.2l2 2"/>
  </g>
  <g id="i-clock" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 6.6V12l3.6 2.2"/>
  </g>
  <g id="i-lock" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10" width="15" height="10.5" rx="3"/><path d="M8.2 10V7.2a3.8 3.8 0 0 1 7.6 0V10"/>
  </g>
  <g id="i-shield" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.6 20 5.9v5.6c0 5-3.4 8.7-8 9.9-4.6-1.2-8-4.9-8-9.9V5.9z"/><path d="M8.6 11.9 11 14.3l4.6-4.7"/>
  </g>
  <g id="i-spark" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.8 13.9 8 19 9.9 13.9 11.8 12 17l-1.9-5.2L5 9.9 10.1 8z"/><path d="M18.4 16.4 19 18l1.6.6-1.6.6-.6 1.6-.6-1.6L16.2 18l1.6-.6z"/>
  </g>
  <g id="i-leaf" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.6 19.4C3 15 4.4 9.2 8.5 6.4c3-2 7-2.2 11-1.6.5 4-.3 8-2.6 10.7-3 3.5-8.4 4.3-12.3 3.9z"/><path d="M5.8 18.2c2.7-3.3 6.2-6 10-7.8"/>
  </g>
  <g id="i-drop" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.2c3.4 4 6.2 7 6.2 10.4A6.2 6.2 0 0 1 12 20.4a6.2 6.2 0 0 1-6.2-6.8C5.8 10.2 8.6 7.2 12 3.2z"/>
  </g>
  <g id="i-bolt" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.4 2.6 5.6 13.4h5.2l-.6 8 7.8-10.8h-5.2z"/>
  </g>
  <g id="i-check" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 12.6 9.6 17.7 19.5 6.9"/>
  </g>
  <g id="i-arrow" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15M13.2 5.6 19.6 12l-6.4 6.4"/>
  </g>
  <g id="i-chev" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5.2 15.8 12 9 18.8"/>
  </g>
  <g id="i-chevd" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.2 9 12 15.8 18.8 9"/>
  </g>
  <g id="i-close" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>
  </g>
  <symbol id="mark" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="15" fill="url(#markG)"/>
    <path d="M17 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
    <path d="M39 18 25 46" stroke="#fff" strokeWidth="5.4" strokeLinecap="round" opacity=".92"/>
    <path d="M47 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
  </symbol>
  <symbol id="mark-ink" viewBox="0 0 64 64">
    <rect x="2.7" y="2.7" width="58.6" height="58.6" rx="13.5" fill="none" stroke="currentColor" strokeWidth="5.4"/>
    <path d="M17 20v24" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
    <path d="M39 18 25 46" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none" opacity=".92"/>
    <path d="M47 20v24" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
  </symbol>
</svg>

<div className="bar" id="bar">
  <div className="wrap bar-in">
    <p className="bar-txt">Founding memberships are open — every room on one key. <a href="#membership">See what's included</a></p>
    <button className="bar-x" id="barX" aria-label="Dismiss"><svg viewBox="0 0 24 24"><use href="#i-close"/></svg></button>
  </div>
</div>

<header className="nav" id="nav">
  <div className="wrap nav-in">
    <a className="logo" href="#top" aria-label="InTension home">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
      <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
    </a>

    <nav className="menu" aria-label="Main">
      <div className="menu-item">
        <button aria-expanded="false" aria-controls="d1">Treatments <svg viewBox="0 0 24 24"><use href="#i-chevd"/></svg></button>
        <div className="drop" id="d1">
          <a href="#heat"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg></span><span><b>Sauna & cold plunge</b><span>Contrast therapy by the hour</span></span></a>
          <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span><span><b>Yoga & mobility</b><span>Slow flow, restore, mobility</span></span></a>
        </div>
      </div>
      <div className="menu-item">
        <button aria-expanded="false" aria-controls="d2">Fuel Lab <svg viewBox="0 0 24 24"><use href="#i-chevd"/></svg></button>
        <div className="drop" id="d2">
          <a href="#fuel-menu"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span><b>The board</b><span>Full menu and pricing</span></span></a>
        </div>
      </div>
      <div className="menu-item"><a href="#membership">Membership</a></div>
    </nav>

    <div className="nav-end">
      <a className="btn btn-plain" href="#gallery">Gallery</a>
      <a className="btn btn-fill" href="#book">Book</a>
      <button className="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<div className="sheet" id="sheet">
  <div className="wrap" style={{paddingInline:0}}>
    <h4>Treatments</h4>
    <div className="grouped">
      <a href="#heat"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg></span>Sauna & cold plunge<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
      <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span>Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
    </div>
    <h4>Fuel Lab</h4>
    <div className="grouped">
      <a href="#fuel-menu"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span>The board<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
    </div>
    <h4>Club</h4>
    <div className="grouped">
      <a href="#membership"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-key"/></svg></span>Membership<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
      <a href="#gallery"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-drop"/></svg></span>Gallery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
    </div>
    <a className="btn btn-fill" href="#book">Book a session</a>
  </div>
</div>

<main className="deck scene-run" id="top">

{/* pinned hero object (Mechanic 4) — the IN/TENSION mark, two variants */}
<div id="hero-object" aria-hidden="true">
  <div className="obj-inner">
    <svg className="variant" viewBox="0 0 64 64"><use href="#mark"/></svg>
    <svg className="variant" viewBox="0 0 64 64"><use href="#mark-ink"/></svg>
  </div>
</div>

{/* HERO (page 1 — sticky base: logo only, centered) */}
<div className="cover-stack">
<section className="scene panel panel--base" data-bg="#FFFFFF" data-ink="dark" id="hero">
  <div className="hero-bg">
    <img className="shot" src="https://images.unsplash.com/photo-1741522509438-a120c0bb5e88?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" fetchPriority="high" decoding="async" referrerpolicy="no-referrer" />
    <img className="shot alt" src="https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" decoding="async" referrerpolicy="no-referrer" />
    <span className="veil" id="heroVeil"></span>
    <span className="veil-w" id="heroVeilW"></span>
  </div>
  <a className="logo logo-lg" href="#top" aria-label="InTension home">
    <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
    <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
  </a>
</section>

{/* INTRO (page 2 — half-hold glass: headline, then the selection row, then the note) */}
<section className="scene panel panel--hold" data-bg="#FFFFFF" data-ink="dark" id="intro">
  <span className="hold-tint" id="holdTint"></span>
  <div className="hero-halo"></div>
  <div className="wrap scene-in">
    <h1>
      <span className="ln"><i>Tension in.</i></span>
      <span className="ln"><i><em>Tension out.</em></i></span>
    </h1>
    <div className="cta-row">
      <a className="btn mag" href="#book">Book a session <svg className="arw" viewBox="0 0 24 24"><use href="#i-arrow"/></svg></a>
    </div>
    <p className="hero-sub">Swedish massage, infrared heat, cold water, movement and a fuel bar — all in one bright, quiet building. Ninety minutes here undoes a whole week out there.</p>
  </div>
</section>

{/* TRUST (page 3 — the purple page, 70% transparent, slides over the first pages) */}
<section className="scene panel panel--cover" data-bg="#8B2BFF" data-ink="light" data-cover="true" id="trust">
  <div className="wrap scene-in">
    <div className="trust">
      <div><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg><b>Licensed</b> therapists</div>
      <div><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg><b>190°</b> infrared</div>
      <div><svg viewBox="0 0 24 24"><use href="#i-cold"/></svg><b>42°</b> plunge</div>
      <div><svg viewBox="0 0 24 24"><use href="#i-clock"/></svg><b>6a–10p</b> daily</div>
    </div>
  </div>
</section>
</div>{/* /cover-stack */}

{/* PROTOCOL */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="protocol">
  <div className="wrap scene-in">
    <div className="proto" id="proto" aria-hidden="true">
      <div className="proto-hd"><i className="pip"></i><span>Session protocol</span><span className="sid num">RESET · 90</span></div>
      <div className="gauge">
        <p className="gauge-lbl">Held tension</p>
        <div className="gauge-num"><b id="tnum">82</b><i>of 100</i></div>
        <div className="gauge-track"><i id="tbar"></i></div>
        <div className="gauge-scale"><span>Wound up</span><span>Unwound</span></div>
      </div>
      <ul className="stages" id="stages">
        <li data-dur="15 min"><i className="mk"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></i>Infrared sauna<span className="dur num"></span></li>
        <li data-dur="60 min"><i className="mk"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></i>Swedish bodywork<span className="dur num"></span></li>
        <li data-dur="3 min"><i className="mk"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></i>Cold plunge<span className="dur num"></span></li>
        <li data-dur="12 min"><i className="mk"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></i>Fuel Lab pour<span className="dur num"></span></li>
      </ul>
      <div className="verdict" id="verdict">
        <svg viewBox="0 0 24 24"><use href="#i-check"/></svg>
        <b>Reset complete</b><span className="num" id="tot">90 min</span>
      </div>
    </div>
  </div>
</section>
{/* HEAT */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="heat">
  <div className="wrap scene-in">
    <div className="art tilt">
      <div className="duo">
        <img className="shot" src="https://images.unsplash.com/photo-1717356495389-6ab1e5ff9d84?fm=jpg&q=76&w=1400&auto=format&fit=crop" alt="The wood-lined interior of a sauna cabin" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
        <span className="tone"></span><img className="tex" src="data:image/webp;base64,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" alt="" aria-hidden="true" loading="lazy" /><span className="lift"></span>
      </div>
      <div className="veil"></div>
      <div className="drift"><i></i><i></i><i></i></div>
      <div className="tag"><span>190° / 42°</span><span>Cycle 3×</span></div>
    </div>
    <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg>Heat & cold</p>
    <h2 className="ticker">
      <span className="sr-only">Sit at 190°. Then don't.</span>
      <span className="line"><span className="word">190°</span></span>
      <span className="line"><span className="word">DON'T</span></span>
    </h2>
    <p>Full-spectrum infrared cabins next to a 42° plunge, so you can run real contrast cycles instead of guessing. Towels, robes and cold eucalyptus cloths are already in the room.</p>
    <div className="chips"><span className="chip">Infrared cabin</span><span className="chip">42° plunge</span><span className="chip">Contrast cycles</span></div>
    <a className="tlink" href="#book">Reserve heat time <svg viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
  </div>
</section>

{/* MOVEMENT */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="movement">
  <div className="wrap scene-in">
    <div className="art tilt">
      <div className="duo">
        <img className="shot" src="https://images.unsplash.com/photo-1761035190790-aa1a3472f7fc?fm=jpg&q=76&w=1600&auto=format&fit=crop" alt="People practicing yoga together in a studio" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
        <span className="tone"></span><img className="tex" src="data:image/webp;base64,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" alt="" aria-hidden="true" loading="lazy" /><span className="lift"></span>
      </div>
      <div className="veil"></div>
      <div className="breath"><i></i><i></i><i></i><b>Breathe</b></div>
      <div className="tag"><span>Studio B</span><span>Max 14 mats</span></div>
    </div>
    <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg>Movement</p>
    <h2 className="ticker">
      <span className="sr-only">Yoga that respects your Tuesday.</span>
      <span className="line"><span className="word">YOGA</span></span>
      <span className="line"><span className="word">TUESDAY</span></span>
    </h2>
    <p>Slow flow, restorative and mobility labs in a calm, bright room. No mirrors, no leaderboard, no one calling out your name. Mats and props are stocked; just bring yourself.</p>
    <div className="chips"><span className="chip">Slow flow</span><span className="chip">Restore</span><span className="chip">Mobility lab</span><span className="chip">Breathwork</span></div>
    <a className="tlink" href="#book">See the schedule <svg viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
  </div>
</section>

{/* GALLERY */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="gallery">
  <div className="wrap scene-in">
    <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>Inside a session</p>
    <h2 className="ticker">
      <span className="sr-only">What ninety minutes looks like</span>
      <span className="line"><span className="word">NINETY</span></span>
      <span className="line"><span className="word">MINUTES</span></span>
    </h2>
    <p>Hover or tap any frame and the violet lifts away, so you see the room in full colour.</p>
  </div>
  <div className="gal-track"><div className="gal-run" id="galRun"></div></div>
</section>

{/* MEMBERSHIP */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="membership">
  <div className="wrap scene-in">
      <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-key"/></svg>Membership</p>
      <h2 className="ticker">
        <span className="sr-only">One key. Every room.</span>
        <span className="line"><span className="word">KEY</span></span>
        <span className="line"><span className="word">ROOM</span></span>
      </h2>
      <p>Monthly credits that spend anywhere in the building — table, cabin, mat or bar — plus the quiet hours nobody else can book.</p>
  </div>
</section>

<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="membership-cards">
  <div className="wrap scene-in">
    <div className="grid">
      <div className="card wide rv tilt">
        <div className="bg"><img className="shot" src="https://images.unsplash.com/photo-1696841212541-449ca29397cc?fm=jpg&q=76&w=1200&auto=format&fit=crop" alt="" aria-hidden="true" loading="lazy" decoding="async" referrerpolicy="no-referrer" /><span className="tone"></span><span className="fade"></span></div>
        <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></div>
        <p className="kicker">Same hands, every time</p>
        <h3>Your therapist is assigned, not rotated</h3>
        <p>They keep notes on your shoulders, your hips, and the pressure you actually like — so session four starts where session three ended.</p>
      </div>

      <div className="card rv d-1 tilt">
        <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg></div>
        <p className="kicker">Credits per month</p>
        <div className="metric" data-count="6">0</div>
        <p style={{marginTop:10}}>Spend them on any table, cabin, class or pour. Unused credits roll one month.</p>
      </div>

      <div className="card rv d-2 tilt">
        <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-clock"/></svg></div>
        <p className="kicker">Quiet hours</p>
        <div className="metric" data-count="14" data-suffix="/wk">0</div>
        <p style={{marginTop:10}}>Members-only blocks each week with half the floor and no walk-ins.</p>
      </div>

      <div className="card rv d-3 tilt">
        <div className="bg"><img className="shot" src="https://images.unsplash.com/photo-1730207375825-d734728f877e?fm=jpg&q=76&w=1200&auto=format&fit=crop" alt="" aria-hidden="true" loading="lazy" decoding="async" referrerpolicy="no-referrer" /><span className="tone"></span><span className="fade"></span></div>
        <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-lock"/></svg></div>
        <p className="kicker">Phone policy</p>
        <h3>Screens stay in the locker</h3>
        <p>It is how the floor stays quiet. Lockers are on the way in, and the desk will hold anything you are waiting on.</p>
      </div>

      <div className="card wide rv d-4 tilt">
        <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg></div>
        <p className="kicker">Included, not upsold</p>
        <h3>Robes, towels, sandals, eucalyptus, showers</h3>
        <p>Everything you need is already in the room and already in the price. There is no retail cart at the end of your massage.</p>
      </div>
    </div>
  </div>
</section>

{/* BOARD */}
<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="fuel-menu">
  <div className="wrap scene-in">
      <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg>Fuel Lab</p>
      <h2 className="ticker">
        <span className="sr-only">The board</span>
        <span className="line"><span className="word">THE</span></span>
        <span className="line"><span className="word">BOARD</span></span>
      </h2>
      <p>Prices are placeholders until your POS is wired in.</p>
  </div>
</section>

<section className="scene" data-bg="#FFFFFF" data-ink="dark" id="board">
  <div className="wrap scene-in">
    <div className="screen">
      <div className="seg-wrap">
        <div className="seg" role="tablist" aria-label="Fuel Lab menu">
          <i id="segbar"></i>
          <button role="tab" aria-selected="true" data-tab="0">Performance</button>
          <button role="tab" aria-selected="false" data-tab="1">Recovery</button>
          <button role="tab" aria-selected="false" data-tab="2">Organic</button>
          <button role="tab" aria-selected="false" data-tab="3">Hydration</button>
        </div>
      </div>
      <div className="pane" data-pane="0">
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-bolt"/></svg></span><span className="mt"><span className="nm">The Rebuild</span><span className="ing">Cacao, banana, oat, peanut, almond milk</span></span><span className="pr">$12</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-bolt"/></svg></span><span className="mt"><span className="nm">The Rebound</span><span className="ing">Espresso, banana, whey, dates, sea salt</span></span><span className="pr">$12</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-bolt"/></svg></span><span className="mt"><span className="nm">The Load</span><span className="ing">Mango, oat, honey, coconut water</span></span><span className="pr">$11</span></div>
      </div>
      <div className="pane" data-pane="1" hidden>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></span><span className="mt"><span className="nm">The Recover</span><span className="ing">Almond, vanilla, pea protein, cinnamon</span></span><span className="pr">$12</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></span><span className="mt"><span className="nm">The Clean</span><span className="ing">Avocado, spinach, pear, pea protein</span></span><span className="pr">$12</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></span><span className="mt"><span className="nm">The Long Sleep</span><span className="ing">Tart cherry, magnesium, oat milk</span></span><span className="pr">$11</span></div>
      </div>
      <div className="pane" data-pane="2" hidden>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span className="mt"><span className="nm">The Green</span><span className="ing">Cacao, banana, pea protein, kale</span></span><span className="pr">$11</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span className="mt"><span className="nm">The Glow</span><span className="ing">Cacao, vanilla, hemp, maca</span></span><span className="pr">$11</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span className="mt"><span className="nm">Cold Press No. 3</span><span className="ing">Celery, cucumber, green apple, lemon</span></span><span className="pr">$10</span></div>
      </div>
      <div className="pane" data-pane="3" hidden>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-drop"/></svg></span><span className="mt"><span className="nm">I/T Energy</span><span className="ing">Matcha, lion's mane, almond milk</span></span><span className="pr">$9</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-drop"/></svg></span><span className="mt"><span className="nm">I/T Hydration</span><span className="ing">Coconut water, sea salt, lime, minerals</span></span><span className="pr">$7</span></div>
        <div className="mrow"><span className="mi"><svg viewBox="0 0 24 24"><use href="#i-cold"/></svg></span><span className="mt"><span className="nm">Post-Plunge Tonic</span><span className="ing">Ginger, turmeric, black pepper, honey</span></span><span className="pr">$7</span></div>
      </div>
    </div>
  </div>
</section>

{/* BOOK */}
<section className="scene" data-bg="#8B2BFF" data-ink="light" id="book">
  <div className="wrap scene-in">
    <div className="close-in">
      <img src="https://images.unsplash.com/photo-1741552205317-817c8c9a4016?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
      <div className="veil"></div>
      <div className="inner">
        <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>Book</p>
        <h2 className="ticker">
          <span className="sr-only">Come in wound up. Leave unrecognisable.</span>
          <span className="line"><span className="word">COME</span></span>
          <span className="line"><span className="word">LEAVE</span></span>
        </h2>
        <p>Pick a table, a cabin, a mat or all three. First-timers get a fifteen-minute intake so your therapist knows what they are working with.</p>
        <div className="cta-row">
          <a className="btn btn-fill mag" href="#book">Book a session <svg className="arw" viewBox="0 0 24 24"><use href="#i-arrow"/></svg></a>
          <a className="btn btn-tint mag" href="#membership">Join the club</a>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

<footer className="foot">
  <div className="wrap">
    <div className="foot-brand">
      <a className="logo" href="#top">
        <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
        <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
      </a>
      <p>Bodywork, heat, movement and fuel — run by people who actually do the work.</p>
      <span className="badge"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg>Licensed massage establishment</span>
    </div>

    <div className="foot-grid">
      <div>
        <h4>Treatments</h4>
        <div className="grouped">
          <a href="#heat">Sauna & plunge<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#movement">Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Fuel Lab</h4>
        <div className="grouped">
          <a href="#fuel-menu">Performance<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#fuel-menu">Recovery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#fuel-menu">Hydration<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Club</h4>
        <div className="grouped">
          <a href="#membership">Membership<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#book">Contact<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
    </div>

    <div className="hours">
      <div><b>Mon – Thu</b>6:00a — 10:00p</div>
      <div><b>Fri</b>6:00a — 11:00p</div>
      <div><b>Sat – Sun</b>7:00a — 9:00p</div>
      <div><b>Quiet hours</b>Members, 6–8a</div>
    </div>

    <div className="legal">
      <a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Accessibility</a><a href="#top">Cancellation</a>
      <span className="note">© 2026 IN/TENSION. Placeholder pricing and hours for layout purposes.</span>
    </div>
  </div>
</footer>
  </>
);
}
