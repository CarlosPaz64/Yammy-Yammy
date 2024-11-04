import { Routes, Route } from 'react-router-dom';
import MenuPage from './menu/menu';
//import PedidoPage from './pages/PedidoPage';
import Pedido from './pagina_principal/HazUnpedido/Pedidos';
//import ConocenosPage from './pages/ConocenosPage';
//import PerfilPage from './pages/PerfilPage';
//import CarritoPage from './pages/CarritoPage';
import NavBar from './pagina_principal/NavBar/NavBar';
import Index from './Index/Index';
import Footer from './pagina_principal/Footer/Footer';
import CrearProducto from './formulario de creacion/creacionProductos';
import RegisterForm from './register/register';
import LoginForm from './pagina_principal/Login/Login';

function App() {
  return (
    <>
      <NavBar />
      <Footer />
      <Routes>
        {/*Rutas del proyecto para acceder a las vistas*/}
        <Route path="/" element={<Index />} />
        <Route path="/pedido" element={<Pedido />} /> 
        <Route path="/login" element={<LoginForm />} />
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