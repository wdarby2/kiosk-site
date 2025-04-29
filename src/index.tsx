import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register the squircle CSS Paint Worklet if supported
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule(new URL('./utils/squircle.js', import.meta.url).toString());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);