import React, { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importar Link
import './NavBar.css';

//Componente del navbar
const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    //Función que abrira el sidebar
    const openSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    //Función para manejar el cambio de tamaño de la página, entre pantalla grandes y pantallas chicas
    const handleResize = ()=> {
        //Valida si el tamaño de la pantalla supera los 1024px de ancho
        if(window.innerWidth > 1024) {
            setSidebarOpen(false); //cierra el Sidebar
        }
    }

    useEffect(() => {
        //Llama al listener para el evento del handleResize
        window.addEventListener('resize', handleResize);
        //Limpia el listener al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    return (
        <>
            {/*Navbar o Sidebar, según sea el tamaño de la pantalla, Este es el nav principal visible para pantallas grandes*/}
            <div className="main-nav">
                <nav>
                    <ul>
                        <li>
                            <Link to="/index">
                                <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" className="img-nav" />
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
                            <div className="tooltip-container">
                                <span className="tooltip-text">Iniciar sesión</span>
                                <li>
                                    <Link to="/login" className="material-symbols-outlined icon-nav">account_circle</Link>
                                </li>
                            </div>
                            <div className="tooltip-container">
                                <span className="tooltip-text">Ver Carrito</span>
                                <li>
                                    <Link to="/carrito" className="material-symbols-outlined icon-nav">shopping_bag</Link>
                                </li>
                            </div>
                        </div>
                    </ul>
                </nav>
            </div>

            {/*
            Navbar secundario para pantallas pequeñas, tabletas y móviles
            Adaptamos el diseño del navbar para pantallas de tabletas y celulares
            Estilo para NavBar -> responsivo a partir de 1024px X 962px
            */}
            <div className={`overlay ${sidebarOpen ? 'overlay-visible' : ''}`} onClick={openSidebar}></div>
            <div className="secundary-nav">
                <nav className="navBar-rwd">
                    <ul className="navBar-list">
                        <div className="tooltip-container">
                            <span className="tooltip-text">Ver Menú</span>
                            <li>
                                <a className="material-symbols-outlined icon-nav iconNav-left" onClick={openSidebar}>menu</a>
                            </li>
                        </div>
                        <div className="nav-center">
                            <li>
                                <Link to = "/index">
                                    <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" className="img-nav" />
                                </Link>
                            </li>
                        </div>
                        <div className="tooltip-container">
                                <span className="tooltip-text">Ver Carrito</span>
                            <li>
                                <Link to = "/carrito" className="material-symbols-outlined icon-nav iconNav-right">shopping_bag</Link>
                            </li>
                        </div>
                    </ul>
                </nav>

                {/* Estilo para SideBar -> responsivo a partir de 1024px X 962px */}
                <div className={`sideBar ${sidebarOpen ? 'sideBar-visible' : ''}`}>
                    <div className="close-sidebar" onClick={openSidebar}>
                        <li>
                            <a className="material-symbols-outlined close">close</a>
                        </li>
                    </div>
                    <ul className="sideBar-panel">
                        <li>
                            <div className="sidebar-header">
                                <a>
                                    <i className="material-symbols-outlined icon-sid">account_circle
                                        <span className="sidText-header">¡Hola, Identificate!</span>
                                    </i>
                                </a>
                            </div>
                        </li>
                        <li>
                            <Link to = "/menu">
                                <span className="textNav">Menú</span>
                            </Link>
                        </li>
                        <li>
                            <Link to = "/pedido">
                                <span className="textNav">Haz un pedido</span>
                            </Link>
                        </li>
                        <li>
                            <Link to = "/conocenos">
                                <span className="textNav">Conócenos</span>
                            </Link>
                        </li>
                        <li>
                            <Link to = "/login" >
                                <span className="textNav textSid-loggin">Iniciar sesión</span>
                            </Link>
                        </li>
                        <li>
                            <Link to ="/logout">
                                <span className="textNav textSid-logout">Cerrar sesión</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {children}
        </>
    );
};

export default NavBar;