import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductos, Producto } from "./productosSlice";
import { AppDispatch, RootState } from "./store";
import { addToCartAsync } from "./cartSlice";
import Carousel from "./carrusel";
import './menu.css';

const MenuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
    "Producto de temporada",
  ];

  const productosPorCategoria = (categoria: string) =>
    productos.filter((producto) => producto.categoria === categoria);

  const handleAddToCart = (producto: Producto) => {
    dispatch(addToCartAsync(producto));
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
      <header className="section-nav">
        <ol>
          {categorias.map((categoria) => (
            <li key={categoria}>
              <a href={`#${categoria.toLowerCase().replace(/\s+/g, "-")}`}>
                {categoria}
              </a>
            </li>
          ))}
        </ol>
      </header>
    </main>
  );
};

export default MenuPage;
