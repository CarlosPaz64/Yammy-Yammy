import React, { ReactNode } from "react";
import './Footer.css';

//Componente del navbar
const Footer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Pie de la página*/}
            <footer>
                <div className="part-coffie">
                    <div className="spillo-chocolate1"></div>
                    <div className="spillo-chocolate2"></div>
                    <div className="spillo-chocolate3"></div>
                </div>
                <h1>YAMY YAMY</h1>
                <div className="part-pink"></div>
                <section className="section-social">
                    {/*Aqui van las redes sociales*/}
                    <p>-- REDES SOCIALES DE LA EMPRESA --</p>
                </section>
                <div className="part-pink"></div>
                <section className="section-slogan">
                    <h2>--SLOGAN DE LA EMPRESA--</h2>
                </section>
                <p>© 2024. Yamy Yamy Cake Company. Reservado todo los derechos.</p>
            </footer>
            {children}
        </>
    )
}

export default Footer;