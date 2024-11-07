import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './menu/store';
import { Provider } from 'react-redux'; // Importa el Provider
import { store } from './redux/store'; // Importa tu store
import App from './App';
import './pagina_principal/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Proveedor de Redux */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
