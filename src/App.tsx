import { Routes, Route } from 'react-router-dom';
import MenuPage from './menu/menu';
import Pedido from './pagina_principal/HazUnpedido/Pedidos';
//import PerfilPage from './pages/PerfilPage';
import NavBar from './pagina_principal/NavBar/NavBar';
import Index from './Index/Index';
import Footer from './pagina_principal/Footer/Footer';
import CartPage from './menu/carrito';
import CrearProducto from './formulario de creacion/creacionProductos';
import RegisterForm from './register/register';
import LoginForm from './pagina_principal/Login/Login';
import Conocenos from './conocenos/conocenos';

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
        {/* <Route path="/perfil" element={<PerfilPage />} /> */}
        <Route path="/creacion" element={<CrearProducto />} /> 
        <Route path="/pedido" element={<Pedido />} /> 
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/conocenos" element={<Conocenos />}/>
        <Route path="/carrito" element={<CartPage />} /> 
      </Routes>
    </>
  );
}

export default App;