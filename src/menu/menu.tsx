// src/components/MenuPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store'; // Importa AppDispatch
import { addToCartAsync } from './cartSlice';
import './menu.css';

export interface Producto {
  product_id: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio: number;
  categoria: string;
  stock: number;
  url_imagen: string;
  epoca?: string;
}

const MenuPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const dispatch = useDispatch<AppDispatch>(); // Usa AppDispatch para tipar el dispatch

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/por-categoria'); {/* Ruta de la API*/}
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const categorias = [
    'Cupcake', 
    'Cupcake personalizado', 
    'Pastel', 
    'Pastel personalizado', 
    'Postre', 
    'Producto de temporada'
  ];

  {/* Filtro por categoria de los productos */}
  const productosPorCategoria = (categoria: string) => {
    return productos.filter((producto) => producto.categoria === categoria);
  };

  const handleAddToCart = (producto: Producto) => {
    console.log('Añadiendo producto al carrito:', producto);
    dispatch(addToCartAsync(producto)); // Llama al thunk para añadir el producto al carrito
  };

  return (
    <main>
      <div className='product-page'>
        {categorias.map((categoria) => (
          <section className='section-menu' id={categoria.toLowerCase().replace(/\s+/g, '-')} key={categoria}>
            <h2>{categoria}</h2>
            <div className="productos-container">
              {productosPorCategoria(categoria).map((producto) => {
                const precioNumerico = typeof producto.precio === 'string'
                  ? parseFloat(producto.precio)
                  : producto.precio;

                return (
                  <div className="producto-card" key={producto.product_id}>
                    <img
                      src={producto.url_imagen.startsWith('data:') ? producto.url_imagen : `data:image/jpeg;base64,${producto.url_imagen}`}
                      alt={producto.nombre_producto}
                      className="producto-imagen"
                    />
                    <h3>{producto.nombre_producto}</h3>
                    <p>{producto.descripcion_producto}</p>
                    <p>
                      Precio: {Number.isFinite(precioNumerico)
                        ? `$${precioNumerico!.toFixed(2)}`
                        : 'Precio no disponible'}
                    </p>
                    <p>
                      Stock: {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                    </p>
                    {producto.epoca && <p>Época: {producto.epoca}</p>}
                    <button
                      onClick={() => handleAddToCart(producto)}
                      disabled={producto.stock === 0}
                      className="btn-add-cart"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                );
              })}
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