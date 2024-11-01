import React, { useEffect, useState } from 'react';
import './menu.css';

interface Producto {
  product_id: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio: string | number | null; // Puede ser una cadena o número
  categoria: string;
  stock: number;
  url_imagen: string;
  epoca?: string;
}

const MenuPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

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
    'Brownies', 
    'Postre', 
    'Postre personalizado', 
    'Crepas', 
    'Roles', 
    'Galleta', 
    'Galleta personalizada', 
    'Producto de temporada'
  ];

  {/* Filtro por categoria de los productos */}
  const productosPorCategoria = (categoria: string) => {
    return productos.filter(producto => producto.categoria === categoria);
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

                  console.log(producto.url_imagen); // Verifica qué cadena está llegando

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