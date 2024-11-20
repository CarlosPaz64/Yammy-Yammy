import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './slices/autentiSlice'; // Ajusta la ruta según tu estructura de archivos
import MenuPage from './menu/menu';
import Pedido from './pagina_principal/HazUnpedido/Pedidos';
import NavBar from './pagina_principal/NavBar/NavBar';
import Index from './Index/Index';
import Footer from './pagina_principal/Footer/Footer';
import CartPage from './menu/carrito';
import CrearProducto from './formulario de creacion/creacionProductos';
import RegisterForm from './register/register';
import LoginForm from './pagina_principal/Login/Login';
import Conocenos from './conocenos/conocenos';
import ProtectedRoute from './ProtectRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Inicializa el estado de auth basado en el token almacenado
    const token = localStorage.getItem('authToken');
    dispatch(initializeAuth(token));
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <Footer />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/conocenos" element={<Conocenos />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/creacion" element={<CrearProducto />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
