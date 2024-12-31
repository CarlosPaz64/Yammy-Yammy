import React, { ReactNode, useEffect } from "react";
import Carrusel1 from '../pagina_principal/Carrusel/Carrusel1';
import './index.css';
//Agregamos redux, Slice y store para la obtención de los datos
import { useSelector, useDispatch } from "react-redux";
import { Producto } from "../menu/productosSlice";
import { AppDispatch, RootState } from "../menu/store";
//funciones que obtienen los datos de los productos
import { fetchProductos } from "../menu/productosSlice";
/*Librerias para implementar diseño del carrusel con Swiper para React*/
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Función para mezclar las imagenes con (shuffle) manejo de array, con esto ponemos de manera aleatoria las imagenes al mostrarlas
const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
};

//Componente del Inicio(Index)
const Index: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();

    //Se Obtiene productos del estado global
    const { productos, loading } = useSelector((state: RootState) => state.productos);

    //Fetch inicial de productos
    useEffect(() => {
        dispatch(fetchProductos());
    }, [dispatch]);

    //Se filtra productos de la categoría "Pastel"
    const pasteles = productos.filter((producto) => producto.categoria === "Pastel");

    //Mezclamos los productos para mostrarlos de forma aleatoria al cargar la página
    const randomObjects = shuffleArray(pasteles);

    /*Garantiza una mejor experiencia al usuario de manera fluida al haber un bucle(duplicado) con pocos slides, 
    garantizando que el modo loop funcione de manera correcta en el carrusel*/
    const duplicarSlides = (slides: Producto[], numDuplicados: number) => {
        if (slides.length > 1) return slides; // No duplicar si ya hay suficientes slides
        return [...slides, ...Array(numDuplicados).fill(slides).flat()];
    };
      
    // Duplica los objetos del carrusel si hay pocos
    const pastelesDuplicados = duplicarSlides(randomObjects, 3);

    return(
        <>
            {/*Inicio de la página principal*/}
                <Carrusel1></Carrusel1>{/* Carrusel de los banners personalizados */}
                <section className="section-index">
                    <div className="container-titleIndex">
                        <h1 className="title-index">¡Tu antojo una realidad!</h1>
                    </div>
                    {/* Aquí empieza el carrusel de imágenes pertenecientes del menú con Swiper y randomizado */}
                    {loading ? (
                      <p>Cargando productos...</p>
                    ) : (
                        <Swiper
                            modules={[Navigation]}
                            loop={true}
                            grabCursor={true}
                            spaceBetween={30}
                            navigation={true}
                            //Medidas responsivas para el carrusel de la dependencia Swiper
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}                        >
                            {pastelesDuplicados.map((pastel, index) => (
                                /*Muestra las imágenes de forma aleatoria con el nombre del producto*/
                                <SwiperSlide key={index}>
                                    <div className="container-sliderMenu">
                                        <div className="img-sliderMenu" data-label={pastel.nombre_producto}>
                                            <img 
                                                src={pastel.url_imagen} 
                                                alt={pastel.nombre_producto} 
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                    {/* Botón para dirigirce al menú */}
                    <div className="container-btnIndex">
                        <a href="/menu" target="_self" className="btn-index">Descubre Más &#187;</a>
                    </div>
                </section>
                {/*Video decoración de pastel YAMY YAMY*/}
                <div className="container-clip">
                    <div className="video-overlay"></div>
                        <div className="over-video">
                            <img src='https://yamy-yamy-api.vercel.app/assets/Yamy-Imagotipo-white.png' alt="Imagotipo" width="50%" />
                            <p>Tu dulce destino a un clic de distancia</p>
                        </div>
                    <video src="https://yamy-yamy-api.vercel.app/assets/clips/yamy.mp4" className="index-clip" autoPlay muted loop disablePictureInPicture></video>
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