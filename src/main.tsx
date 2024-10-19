import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './pagina_principal/MainPage.tsx'
import './css/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
)
