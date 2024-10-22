import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodError, ZodIssue } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './Pedidos.css';

// Esquema de validación con Zod
const schema = z.object({
  categoria: z
    .string()
    .nonempty({ message: "Selecciona una categoría" }),
  descripcion: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
});

// Tipado basado en el esquema de Zod
type FormData = z.infer<typeof schema>;

const Pedido: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    try {
      console.log('Datos enviados:', data);
    } catch (error) {
      if (error instanceof ZodError) {
        // Maneja los errores de Zod específicamente si se captura un ZodError
        error.issues.forEach((issue: ZodIssue) => {
          setError(issue.path[0] as keyof FormData, {
            type: 'manual',
            message: issue.message,
          });
        });
      }
    }
  };

  return (
    <div className='container-pedido'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Select para seleccionar el postre */}
        <div>
        <div className="container-title"><h1>Haz un Pedido</h1></div>

          <label htmlFor="categoria">Selecciona el postre deseado:</label>
          <select {...register('categoria')} id="categoria">
            <option value="select">-- Selecciona --</option>
            <option value="Postres">Postres</option>
            <option value="Pasteles">Pasteles</option>
            <option value="Brownies">Brownies</option>
            <option value="Galletas">Galletas</option>
          </select>
          {errors.categoria && <span>{errors.categoria.message}</span>}
        </div>

        {/* Textarea para la descripción */}
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

        {/* Botón para enviar */}
        <button type="submit">Hacer Pedido</button>
      </form>
    </div>
  );
};

export default Pedido;
