import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CryptoJS from 'crypto-js';
import './Pedidos.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SECRET_KEY = 'tu_clave_secreta';

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

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [opcionEntrega, setOpcionEntrega] = useState<string>('domicilio');
  const [precio, setPrecio] = useState<number>(100); // Precio inicial
  const [isLoading, setIsLoading] = useState(true);
  const [colonias, setColonias] = useState<string[]>([]); // Estado para almacenar las colonias
  const codigoPostal = watch('codigo_postal'); // Observa cambios en el código postal
  const categoria = watch('categoria');
  const ciudad = watch('ciudad');
  const cantidad = watch('cantidad');

  // Desencriptar datos
  const desencriptarDato = (dato: string) => {
    const bytes = CryptoJS.AES.decrypt(dato, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  // Obtener datos del cliente al cargar el componente
  useEffect(() => {
    const fetchClienteData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`${API_URL}/api/cliente/${userId}`);
        const data = await response.json();

        setValue('calle', data.calle);
        setValue('numero_exterior', data.numero_exterior);
        setValue('numero_interior', data.numero_interior);
        setValue('colonia', data.colonia);
        setValue('ciudad', data.ciudad);
        setValue('codigo_postal', data.codigo_postal);
        setValue('descripcion_ubicacion', data.descripcion_ubicacion);
        setValue('numero_telefono', data.numero_telefono);

        setValue('tipo_tarjeta', desencriptarDato(data.tipo_tarjeta));
        setValue('numero_tarjeta', desencriptarDato(data.numero_tarjeta));
        setValue('fecha_tarjeta', desencriptarDato(data.fecha_tarjeta));
        setValue('cvv', desencriptarDato(data.cvv));
      } catch (error) {
        console.error('Error al obtener los datos del cliente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClienteData();
  }, [setValue]);

  // Llama a la API cuando cambia el código postal
  useEffect(() => {
    const fetchCityAndColonies = async () => {
      if (codigoPostal && codigoPostal.length === 5) {
        try {
          const response = await fetch(`${API_URL}/api/codigo-postal/${codigoPostal}`);
          const data = await response.json();

          setValue('ciudad', data.ciudad); // Establece la ciudad como un valor fijo
          setColonias(data.colonias); // Actualiza las opciones del select de colonias
        } catch (error) {
          console.error('Error al obtener ciudad y colonias:', error);
        }
      }
    };

    fetchCityAndColonies();
  }, [codigoPostal, setValue]);

  // Calcular el precio en función de la cantidad, categoría y ciudad
  useEffect(() => {
    let precioBase = 100; // Precio base por categoría
    const costoEnvio = ciudad === 'Mérida' ? 50 : ciudad === 'Progreso' ? 75 : ciudad === 'Umán' ? 80 : ciudad === 'Kanasín' ? 85 : 0;
    const totalPrecio = (precioBase * (cantidad || 1)) + costoEnvio;
    setPrecio(totalPrecio);
  }, [categoria, ciudad, cantidad]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files).slice(0, 2));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      console.log('Este es el token de la sesión: ', token );
      console.log('Este es el id del usuario: ', userId);
      if (!userId || !token) return alert('Por favor, inicie sesión para continuar.');

      const pedidoData = { client_id: userId, token, ...data, cantidad, precio };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(pedidoData), SECRET_KEY).toString();
      const formData = new FormData();
      formData.append('encryptedData', encryptedData);

      imagenes.forEach((imagen) => {
        formData.append('imagenes', imagen);
      });

      const response = await fetch(`${API_URL}/api/pedido-personalizado`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error((await response.json()).message);

      alert('Pedido realizado exitosamente');
    } catch (error: any) {
      console.error('Error al enviar el pedido:', error);
      alert(error.message || 'Error al enviar el pedido');
    }
  };

  return isLoading ? (
    <p>Cargando...</p>
  ) : (
    <div className='container-pedido'>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <select {...register('colonia')}>
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
      </form>
    </div>
  );
};

export default Pedido;
