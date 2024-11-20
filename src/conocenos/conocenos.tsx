import React from 'react';
import './concenos.css';

const Conocenos: React.FC = () => {
  return (
    <div className="conocenosContainer">
      <h2>CÓNOCENOS</h2>

      <section className="section">
        <h3>Descripción de la Empresa</h3>
        <p>
          Nuestra pastelería online está aquí para satisfacer todos tus antojos. Desde Mérida, Yucatán, traemos Yammy-Yammy, una pastelería con una gran variedad de postres que van desde pasteles y cupcakes hasta galletas y otras delicias. Nuestra misión es endulzar tus momentos, ya sea una celebración especial o simplemente un capricho después de un largo día.
          Lo que nos hace diferentes es que cada producto está hecho con ingredientes frescos y de calidad. No solo queremos que se vea bien, ¡sino que también sea increíble! Nos encanta personalizar pasteles para que sean exactamente lo que necesitas para tus eventos, así que si tienes una idea en mente, estamos aquí para hacerlo realidad.
          La experiencia de comprar en Yammy-Yammy es súper fácil. Con solo un clic, puedes elegir lo que quieras desde la comodidad de tu casa, y nosotros nos encargamos del resto. Queremos que disfrutes cada bocado y que cada postre te haga sonreír.
          Así que, ya sea que estés planeando una fiesta o simplemente te apetezca algo dulce, aquí en Yammy-Yammy tenemos lo que buscas. ¡Explora nuestro menú y déjanos ser parte de tus momentos más dulces!
        </p>
        {/* Video para Cónocenos tomada desde la API */}
        <video className="conocenos-video" src="http://localhost:3000/assets/clips/yamy_video.mp4" autoPlay muted loop disablePictureInPicture></video>
      </section>

      <section className="section">
        <h3>Misión</h3>
        <p>
          Somos una empresa que quiere endulzar los momentos especiales de nuestros clientes, ofreciendo postres 
          de alta calidad, siempre frescos y llenos de sabor. Buscamos que cada experiencia de nuestros 
          clientes sea única y accesible, brindando un servicio rápido y eficiente de alta calidad desde nuestra 
          tienda online y directo a la comodidad de tu casa. Buscamos ser tu opción número uno cuando pienses en 
          consentirte o en hacer de una celebración algo inolvidable.
        </p>
        {/* Imagen del Banner tomada desde la API*/}
        <img src='http://localhost:3000/assets/pastel.png' alt="Deliciosos postres de Yammy-Yammy" className="bannerImage" />
      </section>
      
      <section className="section">
        <h3>Visión</h3>
        <p>
          Buscamos convertirnos en la pastelería más reconocida y querida de Mérida, Yucatán, y más allá. Aspiramos 
          a ser el destino preferido para aquellos que buscan postres excepcionales, innovadores y accesibles. 
          Queremos inspirar momentos de alegría y celebración a través de nuestros productos, siempre comprometidos 
          con la calidad, la creatividad y un servicio al cliente excepcional. A través de nuestra tienda online 
          buscamos llegar a más personas y hacer que disfrutar de algo dulce sea fácil y satisfactorio.
        </p>
        
      </section>

      {/* Sección de ubicación */}
      <section className="section">
        <h3>Ubicación</h3>
        <p>C. 22 101B, Chuminópolis, 97158 Mérida, Yuc., México</p>
        <div className="mapContainer">
          <iframe
            title="Ubicación de Yamy-Yamy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0000000000000000!2d-89.6000000000000!3d20.970000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0000000000000000!2sYamy-Yamy!5e0!3m2!1ses-419!2smx!4v1615971234567"
            width="100%"
            height="300"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Conocenos;