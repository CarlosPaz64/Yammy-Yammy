import React, {ReactNode, useState} from "react";

//Componente del navbar
const NavBar: React.FC<{ children?: ReactNode }>= ({children}) => {
    const [isOpen, setIsOpen] = useState(false); //Controla la apertura y cierre del sidebar en el icono de la hamburguesa

    //Función del botón que accionara la apertura del sidebar
    const toggleSideBar = () => {
        setIsOpen(!isOpen) //Abre el sidebar
    }

    return (
        <>
            {/*Navbar o Sidebar, segun sea el tamaño de la pantalla*/}
            <nav className={isOpen ? "open-nav": ""}>
                <ul>
                    <li>
                        <a href="#">
                            <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" className="img-nav" />
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="textNav">Inicio</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="textNav">Menú</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="textNav">Haz un pedido</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="textNav">Conócenos</span>
                        </a>
                    </li>
                    <div className="nav-right">
                        <li>
                            <a href='#' className="material-symbols-outlined icon-nav">account_circle</a>
                        </li>
                        <li>
                            <a href='#' className="material-symbols-outlined icon-nav">shopping_bag</a>
                        </li>
                    </div>
                </ul>
            </nav>
            {/*Botón de menú en forma de hamburguesa para abrir el Sidebar*/}
            <div className="menu-toggle" onClick={toggleSideBar}>
                {!isOpen ? "☰": "X"}
            </div>
            {children}
        </>
    );
};
export default NavBar;