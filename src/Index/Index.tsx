import React, { ReactNode, useState } from "react";
import Carrusel1 from '../pagina_principal/Carrusel/Carrusel1';
import './index.css';

//Componente del Inicio
const Index: React.FC<{ children?: ReactNode }> = ({ children }) => {
    /*Función para establecer la posición inicial del carrusel*/
    const [initialCarousel, setCarousel] = useState(0);
    const img = [
        'http://localhost:3000/assets/Pruebas/P1_cake.jpg',
        'http://localhost:3000/assets/pruebas/P2_cake.jpg',
        'http://localhost:3000/assets/pruebas/P3_cake.jpg',
        'http://localhost:3000/assets/pruebas/P4_cake.jpg',
        'http://localhost:3000/assets/pruebas/P5_cake.jpg',
        'http://localhost:3000/assets/pruebas/P6_cake.jpg',
        'http://localhost:3000/assets/pruebas/P7.avif',
    ];
    
    //Funciones para los controles del carrusel
    const visibleImg = 1; //Desplaza 1 imagen por cada clic
    const totalimgs = img.length;
    const showItems = 3; //Renderiza el número de imágenes visibles como maximo a la vista

    const nextSlide = () => {
        setCarousel((prevIndex) => (prevIndex + visibleImg) % totalimgs);
    };

    const prevSlide = () => {
        setCarousel((prevIndex) => (prevIndex - visibleImg + totalimgs) % totalimgs);
    };

    const getTransformValue = () => {
        return `translateX(-${(initialCarousel % totalimgs) * (100 / showItems)}%)`;
    };

    return(
        <>
            {/*Inicio de la página principal*/}
                <Carrusel1></Carrusel1>
                <section className="section-index">
                    <div className="container-titleIndex">
                        <h1 className="title-index">¡Tu antojo una realidad!</h1>
                    </div>
                    {/* Aquí empieza el carrusel de imágenes pertenecientes al menú */}
                    <div className="container-sliderMenu">
                        {/*Imagenes del carrusel*/}
                        <div className="img-sliderMenu" style={{transform: getTransformValue()}}>
                            {img.map((src, index) => (
                                <img key={index} src={src} alt={`Slide ${index + 1}`} />
                            ))}
                        </div>
                        {/*Controles del carrusel en forma de flechas*/}
                        <div className="control-sliderMenu">
                            <button className="left" onClick={prevSlide}>&#10094;</button>
                            <button className="right" onClick={nextSlide}>&#10095;</button>
                        </div>
                    </div>
                    {/* Botón para dirigirce al menú */}
                    <div className="container-btnIndex">
                        <a href="/menu" target="_self" className="btn-index">Descubre Más &#187;</a>
                    </div>
                </section>
                {/*Video decoración de pastel YAMY YAMY*/}
                <div className="container-clip">
                    <div className="video-overlay"></div>
                        <div className="over-video">
                            <img src='http://localhost:3000/assets/Yamy-Imagotipo-white.png' alt="Imagotipo" width="60%" />
                            <p>Tu dulce destino a un clic de distancia</p>
                        </div>
                    <video src="http://localhost:3000/assets/clips/yamy.mp4" className="index-clip" autoPlay muted loop disablePictureInPicture></video>
                </div>                
                {/*Enlace relacionado al whatsapp */}
                <div className="container-whatsapp">
                    <a href="https://api.whatsapp.com/send?phone=+529994560007&text=¡Hola,%20quiero%20saber%20más%20de%20los%20productos!" 
                    target="_blank" rel="noopener noreferrer" aria-label="Consulta en nuestro whatsapp">
                        <div className="circle-white"></div>
                        <div className="circle-green">
                            <span className="material-symbols-outlined whatsapp-icon">call</span>
                        </div>
                    </a>
                </div>
            {children}
        </>
    )
}

export default Index;