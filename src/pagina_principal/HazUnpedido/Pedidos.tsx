import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchClienteData, fetchCityAndColonies, enviarPedido, calcularPrecio } from './pedidoSlice';
import { useNavigate } from 'react-router-dom';
import './Pedidos.css';

const schema = z.object({
  categoria: z.string().nonempty({ message: "Selecciona una categoría" }),
  descripcion_orden: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  opcion_entrega: z.enum(['domicilio', 'recoger']),
  cantidad: z.number().min(1, { message: "Cantidad mínima es 1" }),
  calle: z.string().optional(),
  numero_exterior: z.string().optional(),
  numero_interior: z.string().optional(),
  colonia: z.string().optional(),
  ciudad: z.string().optional(),
  codigo_postal: z.string().optional(),
  descripcion_ubicacion: z.string().optional(),
  numero_telefono: z.string().optional(),
  tipo_tarjeta: z.string(),
  numero_tarjeta: z.string().min(16).max(16),
  fecha_tarjeta: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/),
  cvv: z.string().min(3).max(3),
});

type FormData = z.infer<typeof schema>;

const Pedido: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { cantidad: 1 },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cliente, colonias, ciudad, precio, isLoading, error } = useAppSelector((state) => state.pedido);

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [opcionEntrega, setOpcionEntrega] = useState<string>('domicilio');
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal

  const codigoPostal = watch('codigo_postal');
  const categoria = watch('categoria');
  const cantidad = watch('cantidad');

  // Obtener datos del cliente al cargar el componente
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchClienteData(userId));
    }
  }, [dispatch]);

  // Sincroniza datos del cliente en el formulario
  useEffect(() => {
    if (cliente) {
      Object.keys(cliente).forEach((key) => {
        setValue(key as keyof FormData, cliente[key]);
      });
    }
  }, [cliente, setValue]);

  // Llama a la API cuando cambia el código postal
  useEffect(() => {
    if (codigoPostal && codigoPostal.length === 5) {
      dispatch(fetchCityAndColonies(codigoPostal));
    }
  }, [codigoPostal, dispatch]);

  // Calcular el precio en función de la cantidad, categoría y ciudad
  useEffect(() => {
    dispatch(calcularPrecio({ categoria, ciudad, cantidad }));
  }, [categoria, ciudad, cantidad, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files).slice(0, 2));
    }
  };

  const onSubmit = async (data: FormData) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!userId || !token) {
      alert('Por favor, inicie sesión para continuar.');
      return;
    }

    const pedidoData = {
      client_id: userId,
      token,
      ...data,
      cantidad,
      precio,
      imagenes,
    };

    const result = await dispatch(enviarPedido(pedidoData));
    if (enviarPedido.fulfilled.match(result)) {
      setModalOpen(true); // Abre el modal
      setTimeout(() => {
        setModalOpen(false);
        navigate('/'); // Redirige después de cerrar el modal
      }, 3000); // 3 segundos
    }
  };

  return isLoading ? (
    <center><p>Cargando...</p></center>
  ) : (
    <div className="container-pedido">
      <form className="forms" onSubmit={handleSubmit(onSubmit)}>
        <div className="container-title"><h1>Haz un Pedido</h1></div>

        <label htmlFor="categoria">Selecciona el postre deseado:</label>
        <select {...register('categoria')} id="categoria">
          <option value="">-- Selecciona --</option>
          <option value="Postres">Postres</option>
          <option value="Pasteles">Pasteles</option>
          <option value="Brownies">Brownies</option>
          <option value="Galletas">Galletas</option>
        </select>
        {errors.categoria && <span>{errors.categoria.message}</span>}

        <label htmlFor="descripcion_orden">Descripción:</label>
        <textarea {...register('descripcion_orden')} id="descripcion_orden" rows={6} placeholder="Describe tu pedido..." />
        {errors.descripcion_orden && <span>{errors.descripcion_orden.message}</span>}

        <label>Cantidad:</label>
        <input type="number" {...register('cantidad', { valueAsNumber: true })} min={1} />

        <label>Precio:</label>
        <input type="text" value={`$${precio}`} readOnly />

        <label>Opción de Entrega:</label>
        <select {...register('opcion_entrega')} onChange={(e) => setOpcionEntrega(e.target.value)}>
          <option value="domicilio">Domicilio</option>
          <option value="recoger">Recoger en tienda</option>
        </select>
        {errors.opcion_entrega && <span>{errors.opcion_entrega.message}</span>}

        {opcionEntrega === 'domicilio' && (
          <>
            <h3>Dirección de Entrega</h3>
            <input {...register('calle')} placeholder="Calle" />
            <input {...register('numero_exterior')} placeholder="Número Exterior" />
            <input {...register('numero_interior')} placeholder="Número Interior" />
            <select {...register('colonia')} value={watch('colonia')}>
              {colonias.map((colonia, index) => (
                <option key={index} value={colonia}>
                  {colonia}
                </option>
              ))}
            </select>
            <input {...register('ciudad')} placeholder="Ciudad" disabled />
            <input {...register('codigo_postal')} placeholder="Código Postal" />
            <input {...register('descripcion_ubicacion')} placeholder="Descripción Ubicación" />
            <input {...register('numero_telefono')} placeholder="Teléfono" />
          </>
        )}

        <h3>Método de Pago</h3>
        <select {...register('tipo_tarjeta')}>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="American Express">American Express</option>
        </select>
        <input {...register('numero_tarjeta')} placeholder="Número de Tarjeta" />
        <input {...register('fecha_tarjeta')} placeholder="Fecha (MM/YY)" />
        <input {...register('cvv')} placeholder="CVV" />

        <label htmlFor="imagenes">Subir imágenes de referencia (máximo 2):</label>
        <input type="file" id="imagenes" multiple accept="image/*" onChange={handleImageChange} />

        <button type="submit">Hacer Pedido</button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Modal de Éxito */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Pedido realizado con éxito!</h2>
            <p>Redirigiendo a la página principal...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedido;