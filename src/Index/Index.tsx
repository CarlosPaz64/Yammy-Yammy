import React, { ReactNode } from "react";
import Carrusel1 from '../pagina_principal/Carrusel/Carrusel1';
import './index.css';

//Componente del Inicio
const Index: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Inicio de la página*/}
                <Carrusel1></Carrusel1>
                <section className="section-index">
                    <h1 className="title-index">¡Tu antojo una realidad!</h1>
                    {/* Aquí empieza el carrusel de imágenes para el menú */}

                    <div className="container-btnIndex">
                        <a href="/menu" target="_self" className="btn-index">Descubre Más &#187;</a>
                    </div>
                    {/*Video decoración de pastel YAMY YAMY*/}
                </section>
                <div className="container-clip">
                        <video src="http://localhost:3000/assets/clips/preparacion1.mp4" className="index-clip" autoPlay muted loop disablePictureInPicture></video>
                    </div>
            {children}
        </>
    )
}

export default Index;