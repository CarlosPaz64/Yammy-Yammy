import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Producto } from "./productosSlice";

interface CarouselProps {
  productos: Producto[];
  onAddToCart: (producto: Producto) => void;
}

const Carousel: React.FC<CarouselProps> = ({ productos, onAddToCart }) => {
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  const handleImageClick = (producto: Producto) => {
    setSelectedProducto(producto);
  };

  const closeModal = () => {
    setSelectedProducto(null);
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        loop={true}
        grabCursor={true}
        spaceBetween={30}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {productos.map((producto) => (
          <SwiperSlide key={producto.product_id}>
            <div className="card-item">
              <img
                src={
                  producto.url_imagen.startsWith("data:")
                    ? producto.url_imagen
                    : `data:image/jpeg;base64,${producto.url_imagen}`
                }
                alt={producto.nombre_producto}
                className="user-image"
                onClick={() => handleImageClick(producto)}
                style={{ cursor: "pointer" }}
              />
              <h2 className="user-name">{producto.nombre_producto}</h2>
              <p className="user-profession">{producto.descripcion_producto}</p>
              <p>Precio: ${producto.precio.toFixed(2)}</p>
              <p>
                Stock:{" "}
                {producto.stock > 0
                  ? `${producto.stock} disponibles`
                  : "Agotado"}
              </p>
              <button
                className="message-button"
                onClick={() => onAddToCart(producto)}
                disabled={producto.stock === 0}
              >
                {producto.stock > 0 ? "Añadir al carrito" : "Agotado"}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal */}
      {selectedProducto && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el modal
          >
            <img
              src={
                selectedProducto.url_imagen.startsWith("data:")
                  ? selectedProducto.url_imagen
                  : `data:image/jpeg;base64,${selectedProducto.url_imagen}`
              }
              alt={selectedProducto.nombre_producto}
              className="modal-image"
            />
            <h2>{selectedProducto.nombre_producto}</h2>
            <p>{selectedProducto.descripcion_producto}</p>
            <p>Precio: ${selectedProducto.precio.toFixed(2)}</p>
            <p>
              Stock:{" "}
              {selectedProducto.stock > 0
                ? `${selectedProducto.stock} disponibles`
                : "Agotado"}
            </p>
            <button
              className="add-to-cart-modal"
              onClick={() => {
                onAddToCart(selectedProducto);
                closeModal();
              }}
              disabled={selectedProducto.stock === 0}
            >
              {selectedProducto.stock > 0
                ? "Añadir al carrito"
                : "Agotado"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;