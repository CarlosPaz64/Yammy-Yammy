import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductos, Producto } from "./productosSlice";
import { AppDispatch, RootState } from "./store";
import { addToCartAsync } from "./cartSlice";
import Carousel from "./carrusel";
import './menu.css';

const MenuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { productos, loading, error } = useSelector(
    (state: RootState) => state.productos
  );

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

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

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <div className="product-page">
        {categorias.map((categoria) => (
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
        ))}
      </div>

      {/* Menú hamburguesa */}
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
                    onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic en una categoría
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