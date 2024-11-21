import React, { useState } from 'react';
import './creacion.css';

const CrearProducto: React.FC = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [epoca, setEpoca] = useState('');
  const [imagen, setImagen] = useState<File | null>(null); // Almacena la imagen seleccionada
  const [mensaje, setMensaje] = useState('');

  const API_LINK = 'http://localhost:3000';

  // Manejar la carga de la imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagen(file); // Almacenar el archivo de imagen
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Crear un objeto FormData para enviar los datos del formulario
    const formData = new FormData();
    formData.append('nombre_producto', nombreProducto);
    formData.append('descripcion_producto', descripcionProducto);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('stock', stock);
    formData.append('epoca', epoca);

    if (imagen) {
      formData.append('url_imagen', imagen); // Adjuntar el archivo de imagen
    }

    try {
      const response = await fetch(`${API_LINK}/api/productos`, {
        method: 'POST',
        body: formData, // Enviar el FormData
      });

      if (response.ok) {
        setMensaje('Producto creado exitosamente');
      } else {
        setMensaje('Error al crear el producto');
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div>
      <h1>Crear Producto</h1>
      <form className="forms" onSubmit={handleSubmit}>
        <label>
          Nombre del Producto:
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Descripción del Producto:
          <textarea
            value={descripcionProducto}
            onChange={(e) => setDescripcionProducto(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Precio:
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Categoría:
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
            <option value="">Seleccione una categoría</option>
            <option value="Cupcake">Cupcake</option>
            <option value="Cupcake personalizado">Cupcake personalizado</option>
            <option value="Pastel">Pastel</option>
            <option value="Pastel personalizado">Pastel personalizado</option>
            <option value="Postre">Postre</option>
            <option value="Producto de temporada">Producto de temporada</option>
          </select>
        </label>
        <br />
        <label>
          Stock:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Época:
          <input
            type="text"
            value={epoca}
            onChange={(e) => setEpoca(e.target.value)}
          />
        </label>
        <br />
        <label>
          Imagen del Producto:
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </label>
        <br />
        <button type="submit">Crear Producto</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearProducto;
