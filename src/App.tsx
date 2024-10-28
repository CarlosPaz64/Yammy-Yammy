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
import Carrusel1 from './pagina_principal/Carrusel/Carrusel1';
import Footer from './pagina_principal/Footer/Footer';
import CrearProducto from './formulario de creacion/creacionProductos';
// import './App.css';
//import './App.css';
import RegisterForm from './register/register';
import LoginForm from './pagina_principal/Login/Login';

function App() {
  return (
    <>
      <NavBar />
      <Carrusel1 />
      <Footer />
      <Routes>
        {/* Define tus rutas aquí */}
        {/*<Route path="/" element={<MainPage />} /> */}
        {/* <Route path="/menu" element={<MenuPage />} /> */}
        <Route path="/pedido" element={<Pedido />} /> 
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/" element={<MainPage />} /> */}
        <Route path="/menu" element={<MenuPage />} /> 
        {/* <Route path="/pedido" element={<PedidoPage />} /> */}
        {/* <Route path="/conocenos" element={<ConocenosPage />} /> */}
        {/* <Route path="/perfil" element={<PerfilPage />} /> */}
        {/* <Route path="/carrito" element={<CarritoPage />} /> */}
        <Route path="/creacion" element={<CrearProducto />} /> 
        <Route path="/pedido" element={<Pedido />} /> 
        <Route path="/registro" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default App;