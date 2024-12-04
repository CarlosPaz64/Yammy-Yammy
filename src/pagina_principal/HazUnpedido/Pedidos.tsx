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
  numero_telefono: z
    .string()
    .length(10, { message: "El número de teléfono debe tener exactamente 10 dígitos" }) // Valida que tenga 10 caracteres
    .regex(/^\d{10}$/, { message: "El número de teléfono solo debe contener dígitos" }), // Valida que sean solo números
  tipo_tarjeta: z.string(),
  numero_tarjeta: z
  .string()
  .refine(
    (value) => value.replace(/\s+/g, '').length === 16, // Valida 16 dígitos eliminando espacios
    { message: "El número de tarjeta debe tener exactamente 16 dígitos" }
  )
  .refine(
    (value) => /^\d{4} \d{4} \d{4} \d{4}$/.test(value), // Valida el formato con espacios
    { message: "El formato del número de tarjeta es inválido (usa 1234 5678 9012 3456)" }
  ),
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

  const fileInputRef = React.useRef<HTMLInputElement | null>(null); // Referencia al input file 
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [opcionEntrega, setOpcionEntrega] = useState<string>('domicilio');
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal
  const [coloniaOrigenCliente, setColoniaOrigenCliente] = useState(true); // Indica si el valor inicial viene del cliente


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
      setColoniaOrigenCliente(true); // Marca que la colonia viene del cliente
    }
  }, [cliente, setValue]);  

  // Llama a la API cuando cambia el código postal
  useEffect(() => {
    if (codigoPostal && codigoPostal.length === 5) {
      dispatch(fetchCityAndColonies(codigoPostal));
      setColoniaOrigenCliente(false); // Indica que el valor ya no viene del cliente
    }
  }, [codigoPostal, dispatch]);

  // UseEffect para las ciudades
  useEffect(() => {
    if (ciudad) {
      setValue('ciudad', ciudad); // Actualiza el valor del campo 'ciudad' en el formulario
    }
  }, [ciudad, setValue]);
  
  // useEffect para las colonias
  useEffect(() => {
    if (colonias.length > 0 && !coloniaOrigenCliente) {
      setValue('colonia', colonias[0]); // Establece la primera colonia como valor predeterminado
    }
  }, [colonias, coloniaOrigenCliente, setValue]);
  
  // Calcular el precio en función de la cantidad, categoría y ciudad
  useEffect(() => {
    dispatch(calcularPrecio({ categoria, ciudad, cantidad }));
  }, [categoria, ciudad, cantidad, dispatch]);

  // Manejo de selección de imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
  
      if (selectedFiles.length > 2) {
        alert('Solo puedes subir un máximo de 2 imágenes.');
        // Resetea el valor del input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
  
      setImagenes(selectedFiles);
    }
  }; 

    // Eliminar una imagen
    const handleRemoveImage = (index: number) => {
      setImagenes((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormData) => {
      // Verifica errores globales de Redux antes de enviar
      if (error) {
        alert('Por favor, corrige los errores antes de enviar el formulario.');
        return;
      }
    
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
    
      // Eliminar campos de domicilio si la opción de entrega es "recoger"
      if (data.opcion_entrega === 'recoger') {
        delete pedidoData.calle;
        delete pedidoData.numero_exterior;
        delete pedidoData.numero_interior;
        delete pedidoData.colonia;
        delete pedidoData.ciudad;
        delete pedidoData.codigo_postal;
        delete pedidoData.descripcion_ubicacion;
      }
    
      // Enviar pedido
      const result = await dispatch(enviarPedido(pedidoData));
      if (enviarPedido.fulfilled.match(result)) {
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
          navigate('/');
        }, 3000);
      } else {
        alert('Hubo un error al procesar el pedido. Inténtalo de nuevo más tarde.');
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
            <h3>Editar dirección de Entrega</h3>
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
            <input {...register('ciudad')} value={ciudad || ""} disabled placeholder="Ciudad" />
            <div className="label">Código Postal: </div>
              <div className="input-with-icon">
                <input
                  {...register("codigo_postal", {
                    required: "Este campo es obligatorio",
                    minLength: { value: 5, message: "El código postal debe tener 5 caracteres" },
                    maxLength: { value: 5, message: "El código postal debe tener 5 caracteres" },
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "El código postal debe ser un número de 5 dígitos",
                    },
                  })}
                  maxLength={5}
                  placeholder="97000"
                />
                <i
                  className="fa fa-info-circle tooltip-icon"
                  aria-hidden="true"
                  title="Solo se aceptan códigos postales de Mérida, Progreso, Kanasín y Umán"
                ></i>
              </div>
              {errors.codigo_postal && <span>{errors.codigo_postal.message}</span>}
              {error && <span style={{ color: "red" }}>{error}</span>}
            <textarea {...register('descripcion_ubicacion')} placeholder="Descripción Ubicación" />
            <input
              {...register('numero_telefono', {
                required: 'El número de teléfono es obligatorio',
                minLength: {
                  value: 10,
                  message: 'El número de teléfono debe tener exactamente 10 caracteres',
                },
                maxLength: {
                  value: 10,
                  message: 'El número de teléfono debe tener exactamente 10 caracteres',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números',
                },
              })}
              placeholder="Teléfono"
            />
            {errors.numero_telefono && (
              <p className="error-message">{errors.numero_telefono.message}</p>
            )}
          </>
        )}

        <h3>Editar tu método de Pago</h3>
        <select
          {...register('tipo_tarjeta', {
            validate: (value) =>
              value === 'Visa' || value === 'MasterCard' || value === 'American Express' || 'Debes seleccionar un tipo de tarjeta válido',
          })}
        >
          <option value="default">Selecciona un tipo de tarjeta</option>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="American Express">American Express</option>
        </select>
        {errors.tipo_tarjeta && <span>{errors.tipo_tarjeta.message}</span>}
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength={19} // Permite 16 dígitos y 3 espacios
          {...register('numero_tarjeta', {
            required: 'El número de tarjeta es obligatorio',
            validate: {
              length: (value) => value.replace(/\s+/g, '').length === 16 || 'El número de tarjeta debe tener exactamente 16 dígitos',
              format: (value) =>
                /^\d{4} \d{4} \d{4} \d{4}$/.test(value) || 'El formato del número de tarjeta es inválido',
            },
          })}
          onInput={(e) => {
            const value = e.currentTarget.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
            e.currentTarget.value = value.match(/.{1,4}/g)?.join(' ') || ''; // Agrega espacios cada 4 dígitos
          }}
        />
        {errors.numero_tarjeta && <span>{errors.numero_tarjeta.message}</span>}
        <input
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            {...register('fecha_tarjeta', {
              required: 'La fecha de expiración es obligatoria',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                message: 'Formato inválido. Usa MM/YY',
              },
            })}
            onInput={(e) => {
              let value = e.currentTarget.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
              if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4); // Agrega '/'
              }
              e.currentTarget.value = value.substring(0, 5); // Limita el largo
            }}
          />
          {errors.fecha_tarjeta && <span>{errors.fecha_tarjeta.message}</span>}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="password"
              maxLength={4}
              placeholder="CVV"
              {...register('cvv', {
                required: 'El CVV es obligatorio',
                minLength: { value: 3, message: 'El CVV debe tener al menos 3 dígitos' },
                maxLength: { value: 4, message: 'El CVV no debe exceder 4 dígitos' },
              })}
              style={{ marginRight: '10px' }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousSibling as HTMLInputElement;
                input.type = input.type === 'password' ? 'text' : 'password';
                e.currentTarget.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
              }}
            >
              Mostrar
            </button>
          </div>
          {errors.cvv && <span>{errors.cvv.message}</span>}

        <label htmlFor="imagenes">Subir imágenes de referencia (máximo 2):</label>
        <input
        type="file"
        id="imagenes"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef} // Asocia la referencia al input
      />

        {/* Previsualización de imágenes */}
        <div className="imagenes-preview">
          {imagenes.map((imagen, index) => (
            <div key={index} className="imagen-item">
              <img
                src={URL.createObjectURL(imagen)}
                alt={`Vista previa ${index + 1}`}
                className="imagen-preview"
              />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => handleRemoveImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

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