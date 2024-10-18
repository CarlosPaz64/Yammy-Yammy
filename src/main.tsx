import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Cambia ReactDOM.render por createRoot en React 18
const container = document.getElementById('root');
const root = createRoot(container!); // El operador "!" asegura que 'root' no sea null

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
