import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom"; // Importar Link
import './NavBar.css'

//Componente del navbar
const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false); //Controla la apertura y cierre del sidebar en el icono de la hamburguesa

    //Función del botón que accionara la apertura del sidebar
    const toggleSideBar = () => {
        setIsOpen(!isOpen); //Abre el sidebar
    }

    return (
        <>
            {/*Navbar o Sidebar, según sea el tamaño de la pantalla*/}
            <nav className={isOpen ? "open-nav" : ""}>
                <ul>
                    <li>
                        <Link to="/">
                            <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" className="img-nav" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <span className="textNav">Inicio</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/menu">
                            <span className="textNav">Menú</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/pedido">
                            <span className="textNav">Haz un pedido</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/conocenos">
                            <span className="textNav">Conócenos</span>
                        </Link>
                    </li>
                    <div className="nav-right">
                        <li>
                            <Link to="/perfil" className="material-symbols-outlined icon-nav">account_circle</Link>
                        </li>
                        <li>
                            <Link to="/carrito" className="material-symbols-outlined icon-nav">shopping_bag</Link>
                        </li>
                    </div>
                </ul>
            </nav>
            {/*Botón de menú en forma de hamburguesa para abrir el Sidebar*/}
            <div className="menu-toggle" onClick={toggleSideBar}>
                {!isOpen ? "☰" : "X"}
            </div>
            {children}
        </>
    );
};

export default NavBar;
