import React, { ReactNode } from "react";
import Carrusel1 from '../pagina_principal/Carrusel/Carrusel1';
import './index.css';

//Componente del Inicio
const Index: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Inicio de la página*/}
                <Carrusel1></Carrusel1>
                <h1> AQUI VA OTRO Carrusel</h1>
                {/*Video decoración de pastel YAMY YAMY*/}
                <center>
                    <video src="http://localhost:3000/assets/clips/preparacion1.mp4" width="100%" height="600" autoPlay muted loop disablePictureInPicture></video>
                </center>
            {children}
        </>
    )
}

export default Index;