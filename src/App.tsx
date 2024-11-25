import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializeAuth } from './slices/autentiSlice'; // Ajusta la ruta según tu estructura de archivos
import MenuPage from './menu/menu';
import Pedido from './pagina_principal/HazUnpedido/Pedidos';
import NavBar from './pagina_principal/NavBar/NavBar';
import Index from './Index/Index';
import Footer from './pagina_principal/Footer/Footer';
import CartPage from './menu/carrito';
import RegisterForm from './register/register';
import LoginForm from './pagina_principal/Login/Login';
import Conocenos from './conocenos/conocenos';
import ProtectedRoute from './ProtectRoute';
import { store } from './menu/store'; // Ajusta la ruta según tu estructura
import { fetchPendingCartWithProductsAsync, clearCart } from './menu/cartSlice';
import { useAppDispatch } from './hooks/reduxHooks'; // Ajusta la ruta según tu estructura

function App() {
  const dispatch = useAppDispatch();

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
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchPendingCartWithProductsAsync()); // Cargar el carrito pendiente si el usuario tiene token
    } else {
      dispatch(clearCart()); // Asegúrate de limpiar el carrito si no hay sesión activa
    }
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
