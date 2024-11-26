import React, { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectTotalItems } from "../../menu/cartSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { clearUser } from "../../slices/userSlice";
import { clearCart, fetchPendingCartWithProductsAsync } from "../../menu/cartSlice";
import "./NavBar.css";
import { logout } from "../../slices/autentiSlice";

const NavBar: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const totalItems = useSelector(selectTotalItems);
    const { nombre_cliente, apellido_cliente } = useSelector(
        (state: any) => state.user || {}
    );
    const token = localStorage.getItem("authToken"); // Detectar si hay token
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Función para abrir/cerrar el sidebar
    const openSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Función para manejar el cambio de tamaño de la página
    const handleResize = () => {
        if (window.innerWidth > 1024) {
            setSidebarOpen(false); // Cierra el sidebar si es pantalla grande
        }
    };

    // Listener para cambio de tamaño de pantalla
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Función que obtiene el carrito pendiente de la sesión
    useEffect(() => {
        if (token) {
          dispatch(fetchPendingCartWithProductsAsync());
        }
      }, [token, dispatch]);

    // Función de logout
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");

        dispatch(logout()); // Actualiza el estado de autenticación en Redux
        dispatch(clearCart()); // Limpia el carrito al cerrar sesión
        dispatch(clearUser()); // Limpia los datos del usuario en Redux
        navigate("/");
    };

    return (
        <>
            {/* Configuracion para navbar cuando pasa a pantallas más grandes o de alta resolución(PC) */}
            <div className="main-nav">
                {/* Navbar principal */}
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <img
                                    src="http://localhost:3000/assets/Yamy-Imagotipo.png"
                                    alt="Imagotipo"
                                    className="img-nav"
                                />
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
                                {token ? (
                                    <>
                                        <span className="tooltip-text">Cerrar sesión</span>
                                        <li>
                                            <a
                                                onClick={handleLogout}
                                                className="material-symbols-outlined icon-nav"
                                            >
                                                logout
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <span className="tooltip-text">Iniciar sesión</span>
                                        <li>
                                            <Link
                                                to="/login"
                                                className="material-symbols-outlined icon-nav"
                                            >
                                                account_circle
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </div>
                            <div className="tooltip-container">
                                <span className="tooltip-text">Ver Carrito</span>
                                <li>
                                    <Link
                                        to="/carrito"
                                        className="material-symbols-outlined icon-nav"
                                    >
                                        shopping_bag
                                    </Link>
                                    {totalItems > 0 && (
                                        <span className="cart-count">{totalItems}</span>
                                    )}
                                </li>
                            </div>
                        </div>
                    </ul>
                </nav>
            </div>
            {/* Configuracion para navbar y sidebar cuando pasa a pantallas más pequeñas(tabletas, laptops y celulares) */}
            <div
                className={`overlay ${sidebarOpen ? "overlay-visible" : ""}`}
                onClick={openSidebar}
            ></div>
            {/* Navbar secundario */}
            <div className="secundary-nav">
                <nav className="navBar-rwd">
                    <ul className="navBar-list">
                        <div className="tooltip-container">
                            <span className="tooltip-text">Ver Menú</span>
                            <li>
                                <a
                                    className="material-symbols-outlined icon-nav iconNav-left"
                                    onClick={openSidebar}
                                >
                                    menu
                                </a>
                            </li>
                        </div>
                        <div className="nav-center">
                            <li>
                                <Link to="/">
                                    <img
                                        src="http://localhost:3000/assets/Yamy-Imagotipo.png"
                                        alt="Imagotipo"
                                        className="img-nav"
                                    />
                                </Link>
                            </li>
                        </div>
                        <div className="tooltip-container">
                            <span className="tooltip-text">Ver Carrito</span>
                            <li>
                                <Link
                                    to="/carrito"
                                    className="material-symbols-outlined icon-nav iconNav-right"
                                >
                                    shopping_bag
                                </Link>
                            </li>
                        </div>
                    </ul>
                </nav>
                {/* sidebar del menú */}
                <div className={`sideBar ${sidebarOpen ? "sideBar-visible" : ""}`}>
                    <div className="close-sidebar" onClick={openSidebar}>
                        <li>
                            <a className="material-symbols-outlined close">close</a>
                        </li>
                    </div>
                    <ul className="sideBar-panel">
                        <li>
                            <div className="sidebar-header">
                                {token ? (
                                    <span className="sidText-header">
                                        ¡Hola, {nombre_cliente || "Invitado" } {apellido_cliente}!
                                    </span>
                                ) : (
                                    <span className="sidText-header">¡Hola, Identifícate!</span>
                                )}
                            </div>
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
                            {token ? (
                                <a
                                    onClick={handleLogout}
                                    className="textNav textSid-logout"
                                >
                                    Cerrar sesión
                                </a>
                            ) : (
                                <Link to="/login">
                                    <span className="textNav textSid-loggin">Iniciar sesión</span>
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