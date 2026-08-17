{/* ════════════════════════════════════════════════════════════
    Footer
    Renders: the site footer (.foot) — brand block, the three link
    columns (Treatments / Fuel Lab / Club), opening hours and the
    legal row.

    Used-by (breadcrumb up): App (src/App.jsx) — last top-level
    sibling in the outer fragment, after </main>.

    Contains (breadcrumb down): <footer class="foot"> > .wrap >
    FooterBrand (src/components/Footer/Brand/index.jsx) +
    FooterColumns (src/components/Footer/Columns/index.jsx) +
    FooterHours (src/components/Footer/Hours/index.jsx) +
    FooterLegal (src/components/Footer/Legal/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import FooterBrand from './Brand';
import FooterColumns from './Columns';
import FooterHours from './Hours';
import FooterLegal from './Legal';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <FooterBrand />

        <FooterColumns />

        <FooterHours />

        <FooterLegal />
      </div>
    </footer>
  );
}
