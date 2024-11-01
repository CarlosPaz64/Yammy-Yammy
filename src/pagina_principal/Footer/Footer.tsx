import React, { ReactNode } from "react";
import './Footer.css';

//Componente del Footer
const Footer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Pie de la página*/}
            <footer>
                {/*Vista para pantallas grandes -> Footer estilo pastel*/}
                <div className="bread-zone"></div>
                <div className="container-chocolate">
                    <div className="melted-chocolate1"></div>
                    <div className="melted-chocolate2"></div>
                    <div className="melted-chocolate3"></div>
                    <div className="melted-chocolate4"></div>
                    <div className="melted-chocolate5"></div>
                    <div className="melted-chocolate6"></div>
                    <div className="melted-chocolate7"></div>
                    <div className="melted-chocolate8"></div>
                    <div className="melted-chocolate9"></div>
                </div>
                <div className="container-candle">
                    <div className="word-candle">
                        <div className="container-stick stick1"></div>
                        <div className="container-stick stick2"></div>
                        <div className="container-stick stick3"></div>
                        <div className="container-stick stick4"></div>
                        <div className="container-stick stick5"></div>
                        <div className="container-stick stick6"></div>
                        <div className="container-stick stick7"></div>
                        <div className="container-stick stick8"></div>
                        <div className="container-stick stick9"></div>
                        <div className="container-stick stick10"></div>
                        <div className="container-stick stick11"></div>
                        <div className="container-stick stick12"></div>
                        <div className="container-stick stick13"></div>
                        <div className="container-stick stick14"></div>
                        YAMY YAMY
                        {/* Iconos de la flama en la vela */}
                        <i className="fi fi-ss-flame candle-flame flame1"></i>
                        <i className="fi fi-ss-flame candle-flame flame2"></i>
                        <i className="fi fi-ss-flame candle-flame flame3"></i>
                        <i className="fi fi-ss-flame candle-flame flame4"></i>
                        <i className="fi fi-ss-flame candle-flame flame5"></i>
                        <i className="fi fi-ss-flame candle-flame flame6"></i>
                        <i className="fi fi-ss-flame candle-flame flame7"></i>
                        <i className="fi fi-ss-flame candle-flame flame8"></i>
                        <i className="fi fi-ss-flame candle-flame flame9"></i>
                        <i className="fi fi-ss-flame candle-flame flame10"></i>
                        <i className="fi fi-ss-flame candle-flame flame11"></i>
                        <i className="fi fi-ss-flame candle-flame flame12"></i>
                        <i className="fi fi-ss-flame candle-flame flame13"></i>
                        <i className="fi fi-ss-flame candle-flame flame14"></i>
                    </div>
                </div>
                <div className="part-pink"></div>
                <section className="section-social">
                    {/*Redes sociales de la Repostería*/}
                    <div className="Container-social">
                        <h2 className="title-social">Siguenos</h2>
                        <div className="content-social">
                            <div className="elfsight-app-7f86dc58-f268-4aa9-801f-c10b3ee16617" data-elfsight-app-lazy></div>
                        </div>
                    </div>
                </section>
                <div className="part-pink"></div>
                <section className="section-slogan">
                    {/*Slogan con Derechos reservados */}
                    <div className="Container-slogan">
                        <h3 className="title-slogan">¡Tu antojo una realidad!</h3>
                        <div className="content-slogan">
                            <p>© 2024. Yamy Yamy Cake Company. Reservado todo los derechos.</p>
                        </div>
                    </div>
                </section>
            </footer>
            {children}
        </>
    )
}

export default Footer;