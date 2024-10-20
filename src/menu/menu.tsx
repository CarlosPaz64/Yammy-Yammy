import React, { useEffect, useState } from 'react';
import './menu.css';

interface Producto {
  product_id: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio: number | null;
  categoria: string;
  stock: number;
  url_imagen: string;
  epoca?: string;
}

const MenuPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    // Función para obtener los productos desde la API por categoría
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/por-categoria');
        const data = await response.json();
        
        // Depurar la longitud de la imagen en base64 para detectar posibles truncamientos
        data.forEach((producto: Producto) => {
          console.log(`Producto: ${producto.nombre_producto}`);
          console.log(`URL Imagen: ${producto.url_imagen}`);
          console.log(`Tamaño de la imagen en base64: ${producto.url_imagen.length} caracteres`);
        });

        setProductos(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Lista de categorías en el orden que debe aparecer
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

  // Filtrar productos por categoría
  const productosPorCategoria = (categoria: string) => {
    return productos.filter(producto => producto.categoria === categoria);
  };

  return (
    <main>
      <div>
        {categorias.map((categoria) => (
          <section id={categoria.toLowerCase().replace(/\s+/g, '-')} key={categoria}>
            <h2>{categoria}</h2>
            <div className="productos-container">
              {productosPorCategoria(categoria).map((producto) => {
                return (
                  <div className="producto-card" key={producto.product_id}>
                    {/* Mostrar la imagen base64 */}
                    <img 
                      src={producto.url_imagen}  
                      alt={producto.nombre_producto} 
                      className="producto-imagen" 
                    />
                    <h3>{producto.nombre_producto}</h3>
                    <p>{producto.descripcion_producto}</p>
                    <p>
                      Precio: {typeof producto.precio === 'number' ? `$${producto.precio.toFixed(2)}` : 'Precio no disponible'}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Navegación de las secciones */}
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
