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
import { store } from './menu/store'; // Ajusta la ruta según tu estructura

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token desde localStorage:', token); // Verificar si el token existe
  
    // Despacha la acción para inicializar el estado
    dispatch(initializeAuth(token));
  
    // Log del estado global después de despachar
    setTimeout(() => {
      console.log('Estado global después de initializeAuth:', store.getState());
    }, 100); // Agregar un pequeño retraso para asegurar que el estado se actualice
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
        <Route path="/creacion" element={<CrearProducto />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrito" element={<CartPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
