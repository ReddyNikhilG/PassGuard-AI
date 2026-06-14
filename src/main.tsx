
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create root outside of render call
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
