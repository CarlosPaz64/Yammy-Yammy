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
                <div className="container-clip">
                    <video src="http://localhost:3000/assets/clips/preparacion1.mp4" className="index-clip" autoPlay muted loop disablePictureInPicture></video>
                </div>
            {children}
        </>
    )
}

export default Index;