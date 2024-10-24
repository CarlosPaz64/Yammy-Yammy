import { Routes, Route } from 'react-router-dom';
//import MainPage from './pagina_principal/MainPage';
import MenuPage from './menu/menu';
//import PedidoPage from './pages/PedidoPage';
//import MenuPage from './pages/MenuPage';
import Pedido from './pagina_principal/HazUnpedido/Pedidos';
//import ConocenosPage from './pages/ConocenosPage';
//import PerfilPage from './pages/PerfilPage';
//import CarritoPage from './pages/CarritoPage';
import NavBar from './pagina_principal/NavBar/NavBar'; // Asegúrate de que NavBar esté en la ruta correcta
import CrearProducto from './formulario de creacion/creacionProductos';
// import './App.css';
//import './App.css';
import RegisterForm from './register/register';

function App() {
  return (
    <>
      <NavBar />
      
      <Routes>
        {/* Define tus rutas aquí */}
        {/* <Route path="/" element={<MainPage />} /> */}
        <Route path="/menu" element={<MenuPage />} /> 
        {/* <Route path="/pedido" element={<PedidoPage />} /> */}
        {/* <Route path="/conocenos" element={<ConocenosPage />} /> */}
        {/* <Route path="/perfil" element={<PerfilPage />} /> */}
        {/* <Route path="/carrito" element={<CarritoPage />} /> */}
        <Route path="/creacion" element={<CrearProducto />} /> 

      <Routes>
        {/* Define tus rutas aquí */}
        {/*<Route path="/" element={<MainPage />} /> */}
        {/* <Route path="/menu" element={<MenuPage />} /> */}
        <Route path="/pedido" element={<Pedido />} /> 
        {/* <Route path="/conocenos" element={<ConocenosPage />} /> */}
        {/* <Route path="/perfil" element={<PerfilPage />} /> */}
        {/* <Route path="/carrito" element={<CarritoPage />} /> */}

        {/* Mueve el bloque de Routes cerrado correctamente */}
        <Route path="/registro" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default App;
