import React, { ReactNode } from "react";
import { Link } from 'react-router-dom'; // Importar Link para la navegación

//Componente del navbar
const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
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
                        {/* Redirige al usuario a la página de login */}
                        <Link to="/login" className="material-symbols-outlined">account_circle</Link>
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