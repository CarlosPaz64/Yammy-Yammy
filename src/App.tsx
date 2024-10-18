import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './Component/NavBar'; // Asegúrate de que la ruta sea correcta
import Login from './login/login'; // Asegúrate de que la ruta sea correcta
import MainPage from './Component/MainPage'; // Crea una página Home si no la tienes
import Dashboard from './admin/dashboard'; // Importa el componente del dashboard
import PrivateRoute from './PrivateAdminRoute'; // Importa el componente PrivateRoute
import './App.css';

function App() {
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token de la sesión
    navigate('/login'); // Redirige al usuario a la página de login después del logout
  };

  return (
    <>
      <NavBar onLogout={handleLogout} /> {/* Pasar la función de logout al NavBar */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
