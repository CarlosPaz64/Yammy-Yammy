import React, { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';

const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const openSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleResize = () => {
        if (window.innerWidth > 1024) {
            setSidebarOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Verifica si el token o el ID de usuario están en localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token || userId) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // Elimina el token y el userId de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <>
            <div className="main-nav">
                <nav>
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
                            <div className="tooltip-container">
                                {isLoggedIn ? (
                                    <>
                                        <span className="tooltip-text">Cerrar sesión</span>
                                        <li onClick={handleLogout} className="material-symbols-outlined icon-nav">
                                            <span>logout</span>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <span className="tooltip-text">Iniciar sesión</span>
                                        <li>
                                            <Link to="/login" className="material-symbols-outlined icon-nav">account_circle</Link>
                                        </li>
                                    </>
                                )}
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
                                <Link to="/">
                                    <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" className="img-nav" />
                                </Link>
                            </li>
                        </div>
                        <div className="tooltip-container">
                            <span className="tooltip-text">Ver Carrito</span>
                            <li>
                                <Link to="/carrito" className="material-symbols-outlined icon-nav iconNav-right">shopping_bag</Link>
                            </li>
                        </div>
                    </ul>
                </nav>

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
                                        <span className="sidText-header">¡Hola, Identifícate!</span>
                                    </i>
                                </a>
                            </div>
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
                        <li>
                            {isLoggedIn ? (
                                <a onClick={handleLogout} className="textNav textSid-logout">
                                    Cerrar sesión
                                </a>
                            ) : (
                                <Link to="/login" className="textNav textSid-loggin">
                                    Iniciar sesión
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            {children}
        </>
    );
};

export default NavBar;
