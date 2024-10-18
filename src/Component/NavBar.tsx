import React, { ReactNode } from "react";
import { Link } from 'react-router-dom'; // Importar Link para la navegación

// Definir las propiedades que acepta el NavBar, incluyendo la función onLogout
type NavBarProps = {
  onLogout: () => void; // Añadir la función onLogout como prop
  children?: ReactNode;
};

// Componente del navbar
const NavBar: React.FC<NavBarProps> = ({ onLogout, children }) => {
  const token = localStorage.getItem('token'); // Verifica si existe un token

  return (
    <>
      {/* Navbar */}
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" width='180px' height='180px'></img>
            </Link>
          </li>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/menu">Menú</Link>
          </li>
          <li>
            <Link to="/pedido">Haz un pedido</Link>
          </li>
          <li>
            <Link to="/conocenos">Conócenos</Link>
          </li>

          <li>
            {/* Si hay token, muestra el botón de logout */}
            {token ? (
              <button onClick={onLogout}>
                Logout
              </button>
            ) : (
              // Si no hay token, mostrar el link al login
              <Link to="/login" className="material-symbols-outlined">account_circle</Link>
            )}
          </li>
          
          <li>
            <Link to="/carrito" className="material-symbols-outlined">shopping_bag</Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
};

export default NavBar;
