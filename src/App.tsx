//import { Routes, Route } from 'react-router-dom';
//import MainPage from './pagina_principal/MainPage';
//import MenuPage from './pages/MenuPage';
//import PedidoPage from './pages/PedidoPage';
//import ConocenosPage from './pages/ConocenosPage';
//import PerfilPage from './pages/PerfilPage';
//import CarritoPage from './pages/CarritoPage';
import NavBar from './pagina_principal/NavBar/NavBar'; // Asegúrate de que NavBar esté en la ruta correcta

function App() {
  return (
    <>
      {/* El NavBar se muestra en todas las páginas */}
      <NavBar />
      
      {/* 
      <Routes>
        {/* Define tus rutas aquí */}
        {/* <Route path="/" element={<MainPage />} /> */}
        {/* <Route path="/menu" element={<MenuPage />} /> */}
        {/* <Route path="/pedido" element={<PedidoPage />} /> */}
        {/* <Route path="/conocenos" element={<ConocenosPage />} /> */}
        {/* <Route path="/perfil" element={<PerfilPage />} /> */}
        {/* <Route path="/carrito" element={<CarritoPage />} /> */}
      {/*</Routes>*/}
    </>
  );
}

export default App;