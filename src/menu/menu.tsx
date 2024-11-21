import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductos, Producto } from './productosSlice';
import { AppDispatch, RootState } from './store';
import { addToCartAsync } from './cartSlice';

const MenuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Obtén el estado de productos desde Redux
  const { productos, loading, error } = useSelector((state: RootState) => state.productos);

  useEffect(() => {
    dispatch(fetchProductos()); // Carga los productos al montar el componente
  }, [dispatch]);

  const categorias = [
    'Cupcake',
    'Cupcake personalizado',
    'Pastel',
    'Pastel personalizado',
    'Postre',
    'Producto de temporada',
  ];

  const productosPorCategoria = (categoria: string) => {
    return productos.filter((producto) => producto.categoria === categoria);
  };

  const handleAddToCart = (producto: Producto) => {
    dispatch(addToCartAsync(producto)); // Añade el producto al carrito
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <div className="product-page">
        {categorias.map((categoria) => (
          <section className="section-menu" id={categoria.toLowerCase().replace(/\s+/g, '-')} key={categoria}>
            <h2>{categoria}</h2>
            <div className="productos-container">
              {productosPorCategoria(categoria).map((producto) => (
                <div className="producto-card" key={producto.product_id}>
                  <img
                    src={producto.url_imagen.startsWith('data:') ? producto.url_imagen : `data:image/jpeg;base64,${producto.url_imagen}`}
                    alt={producto.nombre_producto}
                    className="producto-imagen"
                  />
                  <h3>{producto.nombre_producto}</h3>
                  <p>{producto.descripcion_producto}</p>
                  <p>Precio: ${producto.precio.toFixed(2)}</p>
                  <p>Stock: {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}</p>
                  {producto.epoca && <p>Época: {producto.epoca}</p>}
                  <button
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                    className="btn-add-cart"
                  >
                    Añadir al carrito
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <header className="section-nav">
        <ol>
          {categorias.map((categoria) => (
            <li key={categoria}>
              <a href={`#${categoria.toLowerCase().replace(/\s+/g, '-')}`}>{categoria}</a>
            </li>
          ))}
        </ol>
      </header>
    </main>
  );
};

export default MenuPage;
