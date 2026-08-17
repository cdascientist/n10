{/* ════════════════════════════════════════════════════════════
    BoardScene
    Renders: the FUEL LAB menu screen — the segmented tab row and
    four .pane panels (Performance / Recovery / Organic / Hydration),
    each holding the .mrow menu rows (icon + name + ingredients +
    price). The row data lives here and is handed to each MenuPane.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after FuelMenuScene,
    before BookScene (9th plain scene).

    Contains (breadcrumb down): <section id="board" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > .screen >
    SegTabs (src/components/scenes/BoardScene/SegTabs/index.jsx) +
    4 x MenuPane (src/components/scenes/BoardScene/MenuPane/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import SegTabs from './SegTabs';
import MenuPane from './MenuPane';

const PERFORMANCE = [
  { icon: '#i-bolt', name: 'The Rebuild', ing: 'Cacao, banana, oat, peanut, almond milk', price: '$12' },
  { icon: '#i-bolt', name: 'The Rebound', ing: 'Espresso, banana, whey, dates, sea salt', price: '$12' },
  { icon: '#i-bolt', name: 'The Load', ing: 'Mango, oat, honey, coconut water', price: '$11' },
];

const RECOVERY = [
  { icon: '#i-hands', name: 'The Recover', ing: 'Almond, vanilla, pea protein, cinnamon', price: '$12' },
  { icon: '#i-hands', name: 'The Clean', ing: 'Avocado, spinach, pear, pea protein', price: '$12' },
  { icon: '#i-hands', name: 'The Long Sleep', ing: 'Tart cherry, magnesium, oat milk', price: '$11' },
];

const ORGANIC = [
  { icon: '#i-leaf', name: 'The Green', ing: 'Cacao, banana, pea protein, kale', price: '$11' },
  { icon: '#i-leaf', name: 'The Glow', ing: 'Cacao, vanilla, hemp, maca', price: '$11' },
  { icon: '#i-leaf', name: 'Cold Press No. 3', ing: 'Celery, cucumber, green apple, lemon', price: '$10' },
];

const HYDRATION = [
  { icon: '#i-drop', name: 'I/T Energy', ing: "Matcha, lion's mane, almond milk", price: '$9' },
  { icon: '#i-drop', name: 'I/T Hydration', ing: 'Coconut water, sea salt, lime, minerals', price: '$7' },
  { icon: '#i-cold', name: 'Post-Plunge Tonic', ing: 'Ginger, turmeric, black pepper, honey', price: '$7' },
];

export default function BoardScene() {
  return (
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="board">
      <div className="wrap scene-in">
        <div className="screen">
          <SegTabs />
          <MenuPane dataPane="0" rows={PERFORMANCE} />
          <MenuPane dataPane="1" hidden rows={RECOVERY} />
          <MenuPane dataPane="2" hidden rows={ORGANIC} />
          <MenuPane dataPane="3" hidden rows={HYDRATION} />
        </div>
      </div>
    </section>
  );
}
