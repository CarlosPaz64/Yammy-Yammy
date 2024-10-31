import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodError, ZodIssue } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './Pedidos.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Esquema de validación con Zod
const schema = z.object({
  categoria: z.string().nonempty({ message: "Selecciona una categoría" }),
  descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});

type FormData = z.infer<typeof schema>;

const Pedido: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [imagenes, setImagenes] = useState<File[]>([]);

  // Cargar imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files).slice(0, 2)); // Limitar a dos imágenes
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Obtener user_id y token del almacenamiento local
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert('Por favor, inicie sesión para continuar.');
        return;
      }

      // Crear FormData y agregar datos
      const formData = new FormData();
      formData.append('client_id', userId);
      formData.append('token', token);
      formData.append('categoria', data.categoria);
      formData.append('descripcion', data.descripcion);
      formData.append('opcion_entrega', 'domicilio'); // Aquí puedes hacer dinámica la opción de entrega

      // Agregar imágenes al FormData
      imagenes.forEach((imagen, index) => {
        formData.append(`imagenes`, imagen);
      });

      const response = await fetch(`${API_URL}/api/pedido-personalizado`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el pedido');
      }

      alert('Pedido realizado exitosamente');
    } catch (error: any) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue: ZodIssue) => {
          setError(issue.path[0] as keyof FormData, {
            type: 'manual',
            message: issue.message,
          });
        });
      } else {
        console.error('Error al enviar el pedido:', error);
        alert(error.message || 'Error al enviar el pedido');
      }
    }
  };

  return (
    <div className='container-pedido'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-title"><h1>Haz un Pedido</h1></div>

        <div>
          <label htmlFor="categoria">Selecciona el postre deseado:</label>
          <select {...register('categoria')} id="categoria">
            <option value="">-- Selecciona --</option>
            <option value="Postres">Postres</option>
            <option value="Pasteles">Pasteles</option>
            <option value="Brownies">Brownies</option>
            <option value="Galletas">Galletas</option>
          </select>
          {errors.categoria && <span>{errors.categoria.message}</span>}
        </div>

        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            {...register('descripcion')}
            id="descripcion"
            rows={6}
            placeholder="Describe tu pedido..."
          />
          {errors.descripcion && <span>{errors.descripcion.message}</span>}
        </div>

        <div>
          <label htmlFor="imagenes">Subir imágenes de referencia (máximo 2):</label>
          <input
            type="file"
            id="imagenes"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit">Hacer Pedido</button>
      </form>
    </div>
  );
};

export default Pedido;
