import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductos, Producto } from "./productosSlice";
import { AppDispatch, RootState } from "./store";
import { addToCartAsync } from "./cartSlice";
import Carousel from "./carrusel";
import SkeletonCard from "./skeleton";
import "./menu.css";

const MenuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [retry, setRetry] = useState(false); // Estado para manejar reintentos

  const { productos, loading, error } = useSelector(
    (state: RootState) => state.productos
  );

  // Fetch inicial
  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch, retry]); // Reintenta cuando retry cambia

  // Reintento automático si hay un error
  useEffect(() => {
    if (error) {
      const retryTimeout = setTimeout(() => {
        setRetry((prev) => !prev); // Cambiar el estado para forzar el fetch
      }, 5000); // Reintentar después de 5 segundos

      return () => clearTimeout(retryTimeout); // Limpiar el timeout
    }
  }, [error]);

  const categorias = [
    "Cupcake",
    "Cupcake personalizado",
    "Pastel",
    "Pastel personalizado",
    "Postre",
  ];

  const productosPorCategoria = (categoria: string) =>
    productos.filter((producto) => producto.categoria === categoria);

  const handleAddToCart = (producto: Producto) => {
    dispatch(addToCartAsync(producto));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main>
      <div className="product-page">
        {loading ? (
          <div className="skeleton-container">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
            {error && (
              <div className="error-message">
                <p>
                  No pudimos cargar los productos. Intentando reconectar...
                </p>
              </div>
            )}
          </div>
        ) : (
          categorias.map((categoria) => (
            <section
              className="section-menu"
              id={categoria.toLowerCase().replace(/\s+/g, "-")}
              key={categoria}
            >
              <h2>{categoria}</h2>
              <Carousel
                productos={productosPorCategoria(categoria)}
                onAddToCart={handleAddToCart}
              />
            </section>
          ))
        )}
          <section
            className="section-menu"
            id={categoria.toLowerCase().replace(/\s+/g, "-")}
            key={categoria}
          >
            <h2 className="modal-h2">{categoria}</h2>
            <Carousel
              onAddToCart={handleAddToCart}
            />
          </section>
        ))}
      </div>

      <div className="hamburger-menu-container">
        <button className="hamburger-button" onClick={toggleMenu}>
          ☰
        </button>
        {isMenuOpen && (
          <nav className="dropdown-menu">
            <ul>
              {categorias.map((categoria) => (
                <li key={categoria}>
                  <a
                    href={`#${categoria.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {categoria}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
};

export default MenuPage;