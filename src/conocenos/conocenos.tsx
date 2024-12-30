import React from 'react';
import './conocenos.css';

const Conocenos: React.FC = () => {
  return (
    <section className="about-us">
      {/* Primera sección */}
      <div className="about reverse">
        <img src="https://yamy-yamy-api.vercel.app/assets/Yammy.jpeg" className="pic animate" alt="Deliciosos postres de Yammy-Yammy" />
        <div className="text animate">
          <h2>Conócenos</h2>
          <h5>Pastelería Online <span className='conocenos'>Yammy-Yammy</span></h5>
          <p>
            Nuestra pastelería online está aquí para satisfacer todos tus antojos. Desde Mérida, Yucatán, ofrecemos una
            gran variedad de postres, desde pasteles y cupcakes hasta galletas y otras delicias. Nos especializamos en
            personalizar tus postres para que sean perfectos para tus celebraciones especiales. ¡Explora nuestro menú y
            déjanos ser parte de tus momentos más dulces!
          </p>
        </div>
      </div>

      {/* Segunda sección */}
      <div className="about">
        <img src="https://yamy-yamy-api.vercel.app/assets/conocenos2.jpg" className="pic animate" alt="Nuestra misión en Yammy-Yammy" />
        <div className="text animate">
          <h2>Misión</h2>
          <h5>Pastelería Online <span className='conocenos'>Yammy-Yammy</span></h5>
          <p>
            Somos una empresa que quiere endulzar los momentos especiales de nuestros clientes, ofreciendo postres 
            de alta calidad, siempre frescos y llenos de sabor. Buscamos que cada experiencia de nuestros 
            clientes sea única y accesible, brindando un servicio rápido y eficiente de alta calidad desde nuestra 
            tienda online y directo a la comodidad de tu casa.
          </p>
        </div>
      </div>

      {/* Tercera sección */}
      <div className="about reverse">
        <img src="https://yamy-yamy-api.vercel.app/assets/vision.jpg" className="pic animate" alt="Nuestra visión en Yammy-Yammy" />
        <div className="text animate">
          <h2>Visión</h2>
          <h5>Pastelería Online <span className='conocenos'>Yammy-Yammy</span></h5>
          <p>
            Buscamos convertirnos en la pastelería más reconocida y querida de Mérida, Yucatán, y más allá. Aspiramos 
            a ser el destino preferido para aquellos que buscan postres excepcionales, innovadores y accesibles. 
            Queremos inspirar momentos de alegría y celebración a través de nuestros productos, siempre comprometidos 
            con la calidad, la creatividad y un servicio al cliente excepcional.
          </p>
        </div>
      </div>

      {/* Cuarta sección */}
      <div className="about">
        <div className="mapContainer animate">
          <iframe
            title="Ubicación de Yammy-Yammy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3727.809572064686!2d-89.6563126241615!3d20.879724392879698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f566d97f18084bd%3A0x745021f405ef5f20!2sSin%20Nombre%20No.%207%2C%2097315%20hacienda%20Santa%20cruz%20palomeque%2C%20Yuc.!5e0!3m2!1ses!2smx!4v1733205265053!5m2!1ses!2smx"
            width="600"
            height="450"
            style={{
              border: "0",
              maxWidth: "100%",
              borderRadius: "12px",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="text animate">
          <h2>Ubicación</h2>
          <h5>¡Visítanos en <span className='conocenos'>Mérida, Yucatán</span>!</h5>
          <p>
            Estamos ubicados en C. 22 101B, Chuminópolis, 97158 Mérida, Yuc., México.
            También puedes disfrutar de todos nuestros productos desde la comodidad
            de tu hogar gracias a nuestro sistema de pedidos en línea.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Conocenos;