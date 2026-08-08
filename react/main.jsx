import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const el = document.getElementById('react-app');
if (el) {
  const root = createRoot(el);
  root.render(<App />);
}
