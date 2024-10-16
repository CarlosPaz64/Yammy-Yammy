import React, {ReactNode} from "react";

//Componente del navbar
const NavBar: React.FC<{ children?: ReactNode }>= ({children}) => {
    return (
        <>
            {/*Navbar*/}
            <nav>
                <ul>
                    <li>
                        <a href="#">
                            <img src='../src/assets/Yamy-Imagotipo.png' alt="Imagotipo" width='180px' height='180px'></img>
                        </a>
                    </li>
                    <li>
                        <a href="#">Inicio</a>
                    </li>
                    <li>
                        <a href="#">Menú</a>
                    </li>
                    <li>
                        <a href="#">Haz un pedido</a>
                    </li>
                    <li>
                        <a href="#">Conócenos</a>
                    </li>
                    <li>
                        <a href='#' className="material-symbols-outlined">account_circle</a>
                    </li>
                    <li>
                        <a href='#' className="material-symbols-outlined">shopping_bag</a>
                    </li>
                </ul>
            </nav>
            {children}
        </>
    );
};
export default NavBar;