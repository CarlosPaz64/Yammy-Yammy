import React, { ReactNode, useEffect, useState, useRef  } from "react";
import './Carrusel.css';

//Componente del navbar
const Carrusel1: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = 5; // Total de imágenes en el carrusel
    const slideInterval = useRef<number | null>(null); // Mantener la referencia del intervalo

    // Función para iniciar el carrusel automáticamente
    const startAutoSlide = () => {
        slideInterval.current = window.setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
        }, 5500); // Cambia de diapositiva cada 5.5 segundos
    };

    // Función para detener el carrusel
    const stopAutoSlide = () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
            slideInterval.current = null;
        }
    };

    // Iniciar el carrusel automáticamente cuando el componente se monta
    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide(); // Limpiar el intervalo cuando el componente se desmonta
    }, []);

    // Función para reiniciar el contador
    const resetAndGoToSlide = (index: number) => {
        stopAutoSlide(); // Detenemos el intervalo
        setCurrentIndex(index); // Cambiamos al índice seleccionado
        startAutoSlide(); // Reiniciamos el temporizador
    };

    // Funciones para cambiar de diapositiva manualmente
    const nextSlide = () => {
        resetAndGoToSlide((currentIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        resetAndGoToSlide((currentIndex - 1 + totalSlides) % totalSlides);
    };
    return (
        <>
            {/*Estructura del carrusel de 5 img principales*/}
            <div className="container-carrusel">
                <div className="carrusel-deslizante">
                    {/*Diapositivas del carrusel*/}
                    <div className="carrusel-interno" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        <div className={`carrusel-objeto ${currentIndex === 0 ? '' : ''}`}>
                            <img src='../src/assets/img-carrusel/product_1.jpeg' alt="imagen de publicidad 1"></img>
                        </div>
                        <div className={`carrusel-objeto ${currentIndex === 1 ? '' : ''}`}>
                            <img src='../src/assets/img-carrusel/product_2.jpeg' alt="imagen de publicidad 2"></img>
                        </div>
                        <div className={`carrusel-objeto ${currentIndex === 2 ? '' : ''}`}>
                            <img src='../src/assets/img-carrusel/product_3.jpeg' alt="imagen de publicidad 3"></img>
                        </div>
                        <div className={`carrusel-objeto ${currentIndex === 3 ? '' : ''}`}>
                            <img src='../src/assets/img-carrusel/product_4.jpeg' alt="imagen de publicidad 4"></img>
                        </div>
                        <div className={`carrusel-objeto ${currentIndex === 4 ? '' : ''}`}>
                            <img src='../src/assets/img-carrusel/product_5.jpeg' alt="imagen de publicidad 5"></img>
                        </div>
                    </div>

                    {/*Controles para el carrusel*/}
                    <a className="carrusel-control izq" onClick={prevSlide}>&#10094;</a>
                    <a className="carrusel-control der" onClick={nextSlide}>&#10095;</a>

                    {/*Indicadores*/}
                    <ol className="carrusel-indicador">
                        {[...Array(totalSlides)].map((_, i) => (
                            <li 
                                key={i} 
                                className={currentIndex === i ? 'active' : ''} 
                                onClick={() => resetAndGoToSlide(i)} //Reiniciar el temporizador al hacer clic en un indicador
                            ></li>
                        ))}
                    </ol>
                </div>
            </div>
            {children}
        </>
    )
}

export default Carrusel1;