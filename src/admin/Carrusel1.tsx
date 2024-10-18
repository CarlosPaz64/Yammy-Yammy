import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import './carrusel1.css';

const Carrusel1 = () => {
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto
  const [files, setFiles] = useState<File[]>([]); // Controla las imágenes seleccionadas para subir
  const apiUrl = import.meta.env.VITE_API_LINK;

  // Función para obtener las imágenes del carrusel
  const fetchImagenes = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/carrusel1`);
      const data = await response.json();
      setImagenes(data);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  };

  // Función para eliminar una imagen
  const eliminarImagen = async (idImagen: number) => {
    try {
      await fetch(`${apiUrl}/api/admin/carrusel1/${idImagen}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setImagenes(imagenes.filter((img) => img.idImagen !== idImagen));
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  };

  // Función para subir imágenes al carrusel
  const subirImagenes = async () => {
    const imagenesBase64 = await Promise.all(files.map(convertirABase64));

    for (const base64 of imagenesBase64) {
      if (typeof base64 === 'string') {
        await fetch(`${apiUrl}/api/admin/carrusel1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ imagen: base64, nombreImagen: 'nombre-imagen' }),
        });
      }
    }

    fetchImagenes(); // Refrescar las imágenes después de subirlas
    setFiles([]); // Limpiar los archivos seleccionados
  };

  // Convertir archivo a base64
  const convertirABase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // useDropzone para manejar el drag and drop
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },  // Cambiado a objeto de tipo 'Accept'
    maxFiles: 6,
    onDrop: (acceptedFiles) => {
      if (imagenes.length + acceptedFiles.length > 6) {
        alert('Solo puedes subir hasta 6 imágenes en total.');
        return;
      }
      setFiles([...files, ...acceptedFiles]); // Añadir los nuevos archivos a la lista de archivos
    },
  });

  // useEffect para cargar las imágenes cuando se monta el componente
  useEffect(() => {
    fetchImagenes();
  }, []);

  // Función para abrir/cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="carrusel1">
      {/* Botón para abrir el modal */}
      <button onClick={toggleModal}>Abrir Carrusel 1</button>

      {/* Modal con drag and drop y las imágenes */}
      <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="Carrusel 1 Modal">
        <h2>Carrusel 1</h2>

        {/* Área de arrastre (drag and drop) centrada */}
        <div {...getRootProps({ className: 'dropzone-area' })}>
          <input {...getInputProps()} />
          <div className="dropzone-box">
            <p>Arrastra y suelta tus imágenes aquí</p>
            <p>(Máximo 6 imágenes)</p>
          </div>
        </div>

        {/* Imágenes seleccionadas que se subirán */}
        {files.length > 0 && (
          <div className="preview-grid">
            {files.map((file, index) => (
              <div key={index} className="preview-container">
                <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
              </div>
            ))}
          </div>
        )}

        {/* Botón para confirmar la subida */}
        {files.length > 0 && <button onClick={subirImagenes}>Subir Imágenes</button>}

        {/* Imágenes existentes */}
        <div className="imagenes-grid">
          {imagenes.map((imagen, index) => (
            <div key={index} className="imagen-container">
              <img src={imagen.imagen} alt={`Imagen ${index + 1}`} />
              <button className="delete-button" onClick={() => eliminarImagen(imagen.idImagen)}>X</button>
            </div>
          ))}
        </div>
        
        <button onClick={toggleModal}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default Carrusel1;
