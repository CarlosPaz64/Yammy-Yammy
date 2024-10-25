import React, { ReactNode } from "react";
import './Footer.css';

//Componente del navbar
const Footer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Pie de la página*/}
            <footer>
                <h1>Hola Mundo :D</h1>
                <p>© 2024 Mi Sitio Web. Todos los derechos reservados.</p>
            </footer>
            {children}
        </>
    )
}

export default Footer;