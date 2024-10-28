import React from 'react';
import styles from './Conocenos.module.css';

const Conocenos: React.FC = () => {
  return (
    <div className={styles.conocenosContainer}>
      <h2>Conócenos</h2>

      <section className={styles.section}>
        <h3>Descripción de la Empresa</h3>
        <p>
          Nuestra pastelería online está aquí para satisfacer todos tus antojos. Desde Mérida, Yucatán, traemos 
          Yamy-Yamy, una pastelería con una gran variedad de postres que van desde pasteles y cupcakes hasta 
          galletas y otras delicias. Nuestra misión es endulzar tus momentos, ya sea una celebración especial o 
          simplemente un capricho después de un largo día.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Misión</h3>
        <p>
          Somos una empresa que quiere endulzar los momentos especiales de nuestros clientes, ofreciendo postres 
          de alta calidad, siempre frescos y llenos de sabor. Nosotros buscamos que cada experiencia de nuestros 
          clientes sea única y accesible, brindando un servicio rápido y eficiente de alta calidad desde nuestra 
          tienda online y directo a la comodidad de tu casa. Buscamos ser tu opción número uno cuando pienses en 
          consentirte o en hacer de una celebración algo inolvidable.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Visión</h3>
        <p>
          Buscamos convertirnos en la pastelería más reconocida y querida de Mérida, Yucatán, y más allá. Aspiramos 
          a ser el destino preferido para aquellos que buscan postres excepcionales, innovadores y accesibles. 
          Queremos inspirar momentos de alegría y celebración a través de nuestros productos, siempre comprometidos 
          con la calidad, la creatividad y un servicio al cliente excepcional. A través de nuestra tienda online 
          buscamos llegar a más personas y hacer que disfrutar de algo dulce sea fácil y satisfactorio.
        </p>
      </section>
    </div>
  );
};

export default Conocenos;
