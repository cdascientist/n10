{/* ════════════════════════════════════════════════════════════
    BoardScene
    Renders: the FUEL LAB menu screen — the segmented tab row
    (#segbar sliding indicator; role=tablist with aria-selected and
    data-tab toggling wired by effects.js) plus four .pane panels
    (Performance / Recovery / Organic / Hydration), each holding the
    .mrow menu rows (icon + name + ingredients + price).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after FuelMenuScene,
    before BookScene (9th plain scene).

    Contains (breadcrumb down): <section id="board" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > .screen >
    .seg-wrap > .seg (#segbar + 4 tab buttons) + 4 x .pane[data-pane].
    ════════════════════════════════════════════════════════════ */}

export default function BoardScene() {
  return (
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
  );
}
