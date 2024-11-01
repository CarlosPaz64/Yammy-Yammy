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
                <div className="container-stick">
                    <div className="word-candle">
                        <div className="stick1-candle"></div>
                        <div className="stick2-candle"></div>
                        <div className="stick3-candle"></div>
                        <div className="stick4-candle"></div>
                        <div className="stick5-candle"></div>
                        <div className="stick6-candle"></div>
                        <div className="stick7-candle"></div>
                        <div className="stick8-candle"></div>
                        <div className="stick9-candle"></div>
                        <div className="stick10-candle"></div>
                        <div className="stick11-candle"></div>
                        <div className="stick12-candle"></div>
                        <div className="stick13-candle"></div>
                        <div className="stick14-candle"></div>
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
                    {/*Aqui van las redes sociales*/}
                    <p>-- REDES SOCIALES DE LA EMPRESA --</p>
                </section>
                <div className="part-pink"></div>
                <section className="section-slogan">
                    <h2>¡Tu antojo una realidad!</h2>
                </section>
                <p>© 2024. Yamy Yamy Cake Company. Reservado todo los derechos.</p>
            </footer>
            {children}
        </>
    )
}

export default Footer;