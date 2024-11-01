import React, { ReactNode } from "react";
import Carrusel1 from '../pagina_principal/Carrusel/Carrusel1';
/*import './Footer.css';*/

//Componente del Inicio
const Index: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Inicio de la página*/}
                <Carrusel1></Carrusel1>
                <h1> AQUI VA OTRO Carrusel</h1>
            {children}
        </>
    )
}

export default Index;