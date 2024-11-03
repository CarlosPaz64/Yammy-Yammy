import React, { ReactNode } from "react";
import './Footer.css';

//Componente del Footer
const Footer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return(
        <>
            {/*Pie de la página*/}
            <footer>
                {/*Footer estilo pastel*/}
                <div className="bread-zone"></div>
                {/*Vista para pantallas grandes -> chocolate derretido*/}
                <div className="main-chocolate">
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
                </div>
                {/*Vista para tabletas -> chocolate derretido*/}
                <div className="secondary-chocolate">
                    <div className="container-chocolate">
                        <div className="melted-chocolate1"></div>
                        <div className="melted-chocolate2"></div>
                        <div className="melted-chocolate3"></div>
                        <div className="melted-chocolate4"></div>
                        <div className="melted-chocolate5"></div>
                    </div>
                </div>
                {/*Vista para celulares -> chocolate derretido*/}
                <div className="tertiary-chocolate">
                    <div className="container-chocolate">
                        <div className="melted-chocolate1"></div>
                        <div className="melted-chocolate2"></div>
                        <div className="melted-chocolate3"></div>
                    </div>
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
                <div className="cake-layer"></div>
                <section className="section-social">
                    {/*Redes sociales de la Repostería*/}
                    <h2 className="title-social">Siguenos</h2>
                    <div className="container-social">
                        <a href="https://www.facebook.com/profile.php?id=100090051422438" target="_blank" rel="noopener" aria-label="Síguenos en Facebook">
                            <img src="/src/assets/img-social/Simple_Icons/facebook.svg" alt="Facebook" className="social-icons" />
                        </a>
                        <a href="https://www.instagram.com/yamy_postres?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener" aria-label="Síguenos en Instagram">
                            <img src="/src/assets/img-social/Simple_Icons/instagram.svg" alt="Instagram" className="social-icons" />
                        </a>
                        <a href="https://www.tiktok.com/@yamyyamyp?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener" aria-label="Síguenos en Tiktok">
                            <img src="/src/assets/img-social/Simple_Icons/tiktok.svg" alt="Tiktok" className="social-icons" />
                        </a>
                        <a href="mailto:yamygomez.19@gmail.comsubject=Obtener más información" target="_blank" rel="noopener" aria-label="Síguenos en Gmail">
                            <img src="/src/assets/img-social/Simple_Icons/gmail.svg" alt="Gmail" className="social-icons" />
                        </a>
                    </div>
                </section>
                <div className="cake-layer"></div>
                <section className="section-slogan">
                    {/*Slogan con Derechos reservados */}
                    <div>
                        <h3 className="title-slogan">¡Tu antojo una realidad!</h3>
                        <div className="content-slogan">
                            <p className="text-slogan">© 2024. Yamy Yamy Cake Company. Reservado todo los derechos.</p>
                        </div>
                    </div>
                </section>
            </footer>
            {children}
        </>
    )
}

export default Footer;