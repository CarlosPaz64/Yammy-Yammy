import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from './store';
import {
  removeFromCartAsync,
  incrementQuantityAsync,
  decrementQuantityAsync,
  finalizeCartAsync,
  validateSessionAndClearCartAsync,
  fetchCartClientDataAsync,
  fetchCartProductsAsync,
  clearError,
  fetchPendingCartWithProductsAsync
} from './cartSlice';
import axios from 'axios'; // Para consumir la API de códigos postales
import './carrito.css';
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartError = useSelector((state: RootState) => state.cart.error);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (total, item) => total + (Number(item.precio) || 0) * item.quantity,
    0
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal -> finalizar compra
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal de Finalización de compra
  const [isFinalizing, setIsFinalizing] = useState(false); // Modo de finalizar compra + Modal de confirmar compra y Finalización de compra
  const [isClosing, setIsClosing] = useState(false); // Animacion del cierre del modal confirmar compra 
  const [colonias, setColonias] = useState<string[]>([]); // Opciones de colonias
  const [errors, setErrors] = useState<{ numero_tarjeta?: string; fecha_tarjeta?: string; cvv?: string; numero_telefono?: string; }>({}); // Tipado de errores para los valores bancarios
  const [errorFetch, setErrorFetch] = useState<string | null>(null); // Errores del fetch del código postal, ciudad y colonias
  const [clientData, setClientData] = useState({
    opcion_entrega: 'domicilio',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    ciudad: '',
    codigo_postal: '',
    descripcion_ubicacion: '',
    numero_telefono: '',
    tipo_tarjeta: '',
    numero_tarjeta: '',
    fecha_tarjeta: '',
    cvv: '',
  });

  // Validar sesión al montar
  useEffect(() => {
    dispatch(validateSessionAndClearCartAsync());
  }, [dispatch]);

  // Cargar productos del carrito
  useEffect(() => {
    const carritoId = localStorage.getItem('carritoId');
    if (carritoId) {
      dispatch(fetchCartProductsAsync(Number(carritoId))); // Cargar productos del carrito
    } else {
      dispatch(fetchPendingCartWithProductsAsync()); // Intenta recuperar el carrito pendiente
    }
  }, [dispatch]);
  
  // Cargar datos del cliente al iniciar la finalización
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (isFinalizing && userId) {
      dispatch(fetchCartClientDataAsync(Number(userId)))
        .unwrap()
        .then((data) => {
          console.log('Datos obtenidos del cliente:', data); // Debugging

          // Mapea los datos si las claves no coinciden
          setClientData((prevData) => ({
            ...prevData,
            calle: data.calle || '',
            numero_exterior: data.numero_exterior || '',
            numero_interior: data.numero_interior || '',
            colonia: data.colonia || '',
            ciudad: data.ciudad || '',
            codigo_postal: data.codigo_postal || '',
            descripcion_ubicacion: data.descripcion_ubicacion || '',
            numero_telefono: data.numero_telefono || '',
          }));
        })
        .catch((error) => {
          console.error('Error al obtener los datos del cliente:', error);
        });
    }
  }, [isFinalizing, dispatch]);

  // Buscar datos del código postal
  const fetchZipCodeData = async (codigoPostal: string) => {
    try {
      setErrorFetch(null); // Resetea errores previos
      const response = await axios.get(`https://yamy-yamy-api.vercel.app/api/codigo-postal/${codigoPostal}`);
      const { ciudad, colonias } = response.data;
  
      // Actualiza los datos del cliente con ciudad y primera colonia
      setClientData((prevData) => ({
        ...prevData,
        ciudad,
        colonia: colonias[0] || '',
      }));
      setColonias(colonias);
    } catch (error) {
      console.error('Error al obtener datos del código postal:', error);
      setErrorFetch('No se encontraron datos para este código postal');
      setClientData((prevData) => ({
        ...prevData,
        ciudad: '',
        colonia: '',
      }));
      setColonias([]);
    }
  };

  // Detectar cambio en el código postal
  useEffect(() => {
    if (clientData.codigo_postal.length === 5) {
      fetchZipCodeData(clientData.codigo_postal);
    }
  }, [clientData.codigo_postal]);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

      // Validación específica para el número de teléfono
      if (name === 'numero_telefono') {
        const sanitizedValue = value.replace(/\D/g, ''); // Elimina caracteres no numéricos
        if (sanitizedValue.length > 10) {
          return; // No permite más de 10 caracteres
        }

        setClientData((prevData) => ({
          ...prevData,
          [name]: sanitizedValue,
        }));

        // Validar longitud del teléfono
        setErrors((prevErrors) => ({
          ...prevErrors,
          numero_telefono:
            sanitizedValue.length === 10
              ? undefined
              : 'El número de teléfono debe tener exactamente 10 dígitos',
        }));

        return;
      }

    // Lógica específica para el número de tarjeta
    if (name === 'numero_tarjeta') {
      let sanitizedValue = value.replace(/\D/g, ''); // Elimina caracteres no numéricos
      if (sanitizedValue.length > 16) sanitizedValue = sanitizedValue.slice(0, 16); // Limita a 16 dígitos
      const formattedValue = sanitizedValue.match(/.{1,4}/g)?.join(' ') || ''; // Agrega espacios cada 4 dígitos
  
      // Validación del formato de la tarjeta
      const isValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(formattedValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        numero_tarjeta: isValid ? undefined : 'El formato del número de tarjeta es inválido',
      }));
  
      setClientData((prevData) => ({
        ...prevData,
        [name]: formattedValue, // Actualiza el estado con el valor formateado
      }));
      return;
    }
    if (name === 'fecha_tarjeta') {
      // Validación de fecha de expiración
      let sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 2) {
        sanitizedValue = sanitizedValue.substring(0, 2) + '/' + sanitizedValue.substring(2, 4);
      }
      sanitizedValue = sanitizedValue.substring(0, 5); // Limita el largo a 5 caracteres (MM/YY)
      const isValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(sanitizedValue);
  
      setErrors((prevErrors) => ({
        ...prevErrors,
        fecha_tarjeta: isValid ? undefined : 'Formato inválido. Usa MM/YY',
      }));
  
      setClientData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
      return;
    }
  
    if (name === 'cvv') {
      // Validación de CVV
      const sanitizedValue = value.replace(/\D/g, '').substring(0, 4); // Solo números, máximo 4 dígitos
      const isValid = sanitizedValue.length >= 3 && sanitizedValue.length <= 4;
  
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvv: isValid ? undefined : 'El CVV debe tener entre 3 y 4 dígitos',
      }));
  
      setClientData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
      return;
    }
  
    // Lógica general para otros campos
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };  

  // Cierra el formulario si no hay productos en el carrito
  useEffect(() => {
    if (cartItems.length === 0 && isFinalizing) {
      setIsFinalizing(false);
    }
  }, [cartItems, isFinalizing]);
  
  // Ejecuta el modal -> confirmar compra
  const handleFinalizePurchase = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error('El carrito está vacío. No puedes finalizar la compra.', {
          position: "top-right", // Posición de la notificación
          autoClose: 3000,       // Tiempo en ms para que se cierre automáticamente
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      setIsFinalizing(true);
      dispatch(clearError()); // Limpia errores previos
      const carritoId = localStorage.getItem('carritoId');
      if (!carritoId) {
        setModalMessage('No hay carrito activo. Por favor, agrega productos antes de finalizar la compra.');
        setIsModalOpen(true);
        return;
      }

      const dataToSend = { ...clientData };
      if (clientData.opcion_entrega === 'recoger') {
        Object.assign(dataToSend, {
          calle: '',
          numero_exterior: '',
          numero_interior: '',
          colonia: '',
          ciudad: '',
          codigo_postal: '',
          descripcion_ubicacion: '',
          numero_telefono: '',
        });
      }

      await dispatch(finalizeCartAsync(dataToSend)).unwrap();
      setModalMessage(
        'Gracias por comprar con Yamy Yamy. Dentro de los siguientes días, te contactaremos vía email para aclarar los detalles de la compra.'
      );
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      setModalMessage(`Error al finalizar la compra: ${error}`);
      setIsModalOpen(true);
    }
  };

  // Cierra el modal de confirmar compra + Animación para cerrar el modal
  const closeModalConfirm = () =>{
    //Se añade la animacion de cierre del modal
    setIsClosing(true); //Activamos la animación de cierre
    setTimeout(() => {
      setIsFinalizing(false); //Cierra el modal después de la animación
      setIsClosing(false); // Reiniciamos el estado de cerrar modal
    }, 300); //Duracion de 0.3 segundos con relación a la transición del css
  }

  // Maneja el Cierra del Modal de finalizar compra y el mensaje de finalización de compra
  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage.startsWith('Gracias por comprar')) {
      navigate('/'); // Redirige a la página principal
    }
  };
  const handleRemoveItem = async (carrito_producto_id: number) => {
    try {
      await dispatch(removeFromCartAsync(carrito_producto_id)).unwrap();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleIncrementQuantity = async (carrito_producto_id: number) => {
    try {
      await dispatch(incrementQuantityAsync({ carrito_producto_id, cantidad: 1 })).unwrap();
      const carritoId = Number(localStorage.getItem('carritoId'));
      if (carritoId) {
        await dispatch(fetchCartProductsAsync(carritoId)); // Refresca los datos del carrito
      }
    } catch (error) {
      console.error('Error al incrementar la cantidad:', error);
    }
  };  

  const handleDecrementQuantity = async (carrito_producto_id: number) => {
    console.log('Botón de restar clicado, ID:', carrito_producto_id); // Verifica si esto aparece
    try {
      await dispatch(decrementQuantityAsync({ carrito_producto_id, cantidad: 1 })).unwrap();
    } catch (error) {
      console.error('Error al reducir la cantidad:', error);
    }
  };

  // Bloquea el scroll del body cuando el modal del formulario "Proceder Compra" se encuentre abierto
  useEffect(() => {
    if (isFinalizing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible'; // Reactiva scroll vertical pero oculta scroll horizontal
      document.body.style.overflowX = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'visible'; // Reactiva scroll vertical pero oculta scroll horizontal
      document.body.style.overflowX = 'hidden';
    };
  }, [isFinalizing]);

  return (
    <div className='shopping-container'>
      <div className='shopping-content'>
        <div className='responsive-table'>
          <h2 className='shopping-title title-sticky'>Tu Carrito de Compras</h2>
          {cartError && <p style={{ color: 'red', textAlign: 'center', margin:'0 0 15px 0'}}>{cartError}</p>}
          {cartItems.length === 0 ? (
            <center><p>No tienes productos en el carrito.</p>
              <br /><p>Añade productos para comenzar a disfrutar de deliciosos postres que <b>Yamy Yamy</b> te ofrece</p></center>
          ) : (
            <>
              <table className='list-object'>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.carrito_producto_id}>
                      <td>
                        {item.url_imagen ? (
                          <img
                            src={
                              item.url_imagen.startsWith('data:')
                                ? item.url_imagen
                                : `data:image/jpeg;base64,${item.url_imagen}`
                            }
                            alt={item.nombre_producto || 'Producto'}
                            style={{ width: '100%', height: '100px ', objectFit: 'cover', filter: 'contrast(140%)' }}
                          />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </td>
                      <td>{item.nombre_producto}</td>
                      <td><span className='colorPurchase-stock'>{item.quantity}</span></td>
                      <td><span className='colorPurchase-amount'>${(Number(item.precio) || 0).toFixed(2)}</span></td>
                      <td><span className='colorPurchase-amount'>${((Number(item.precio) || 0) * item.quantity).toFixed(2)}</span></td>
                      <td>
                        <button
                          className='btn-action-delete btn-actions'
                          onClick={() => handleDecrementQuantity(item.carrito_producto_id)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button className='btn-action-add btn-actions' onClick={() => handleIncrementQuantity(item.carrito_producto_id)}>+</button>
                        <button 
                          className='btn-action-delete btn-actions' 
                          onClick={() => handleRemoveItem(item.carrito_producto_id)}>
                          <i className='icon-trash material-symbols-outlined'>delete</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      {/* Validamos si existen productos en el carrito, de lo contrario permanece oculto este contenedor */}
      {cartItems.length > 0 && (
        <div className='procedure-container'>
          <div className='procedure-content'>
            <div className='informationPurchase-procedure'>
              <h3>Total de Artículos: <span className='colorPurchase-stock'>{totalItems}</span></h3>
              <h3>Monto Total: <span className='colorPurchase-amount'>${totalAmount.toFixed(2)}</span></h3>
              {!isFinalizing && (
                <button onClick={() => setIsFinalizing(true)}>Proceder Compra</button>
              )} 
            </div>
          </div>
        </div>
      )}

      {/*Modal del Formulario para confirmar Compra*/}
      {isFinalizing && (
        <div className={`overModal ${isClosing ? 'closing':''}`}>
          <form className={`modal-container ${isClosing ? 'modal-closing':''}'`} onSubmit={(e) => { e.preventDefault(); handleFinalizePurchase(); }}>
            <div className='header-formModal'>
              <div className='container-titleModal'>
                <img 
                  src="https://yamy-yamy-api.vercel.app/assets/Yamy-Imagotipo-white.png"
                  alt="Imagotipo"
                />
                <h1 className='titleModal'> Confirmar compra</h1>
              </div>
              <a onClick={closeModalConfirm} className='container-btn-closeModal btn-closeModal'>x</a>
            </div>
            <div className='body-formModal'>
              <h3 className='body-titleModal'>Opción de Entrega</h3>
              <select className="select-formModal" name="opcion_entrega" value={clientData.opcion_entrega} onChange={handleInputChange} required>
                <option value="domicilio">Domicilio</option>
                <option value="recoger">Recoger en tienda</option>
              </select>
              {clientData.opcion_entrega === 'domicilio' && (
                <>
                  <h3 className='body-titleModal'>Datos de Envío</h3>
                  <input
                    className="input-formModal"
                    type="text"
                    name="codigo_postal"
                    placeholder="Código Postal"
                    value={clientData.codigo_postal}
                    onChange={(e) => {
                      const { value } = e.target;
                      const sanitizedValue = value.replace(/\D/g, '').substring(0, 5); // Acepta solo números
                      setClientData((prevData) => ({
                        ...prevData,
                        codigo_postal: sanitizedValue,
                      }));
                      if (sanitizedValue.length === 5) fetchZipCodeData(sanitizedValue); // Llama a la API al completar
                    }}
                    maxLength={5}
                    required
                  />
                  {errorFetch && <span style={{ color: 'red' }}>{errorFetch}</span>}
                  <input
                    className="input-formModal"
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={clientData.ciudad}
                    readOnly
                  />
                        <select
                          className="select-formModal"
                          name="colonia"
                          value={clientData.colonia}
                          onChange={(e) =>
                            setClientData((prevData) => ({
                              ...prevData,
                              colonia: e.target.value,
                            }))
                          }
                          required
                        >
                          {colonias.map((colonia, index) => (
                            <option key={index} value={colonia}>
                              {colonia}
                            </option>
                          ))}
                        </select>
                  <input
                    className='input-formModal'
                    type="text"
                    name="calle"
                    placeholder="Calle"
                    value={clientData.calle}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className='input-formModal'
                    type="text"
                    name="numero_exterior"
                    placeholder="Número Exterior"
                    value={clientData.numero_exterior}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className='input-formModal'
                    type="text"
                    name="numero_interior"
                    placeholder="Número Interior (Opcional)"
                    value={clientData.numero_interior}
                    onChange={handleInputChange}
                  />
                  <input
                    className='input-formModal'
                    type="text"
                    name="descripcion_ubicacion"
                    placeholder="Descripción de Ubicación"
                    value={clientData.descripcion_ubicacion}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                  className="input-formModal"
                  type="text"
                  name="numero_telefono"
                  placeholder="Número de Teléfono"
                  value={clientData.numero_telefono}
                  onChange={handleInputChange}
                  required
                />
                {errors.numero_telefono && <span style={{ color: 'red' }}>{errors.numero_telefono}</span>}
                </>
              )}
              <h3 className='body-titleModal'>Datos de la Tarjeta</h3>
              <select
                className="select-formModal"
                name="tipo_tarjeta"
                value={clientData.tipo_tarjeta}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione el tipo de tarjeta</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="American Express">American Express</option>
              </select>
              <input
                className="input-formModal"
                type="text"
                name="numero_tarjeta"
                placeholder="1234 5678 9012 3456"
                value={clientData.numero_tarjeta}
                onChange={handleInputChange}
                maxLength={19} // Incluye espacios
                required
              />
              {errors.numero_tarjeta && <span style={{ color: 'red' }}>{errors.numero_tarjeta}</span>}
              <input
                className="input-formModal"
                type="text"
                name="fecha_tarjeta"
                placeholder="MM/YY"
                value={clientData.fecha_tarjeta}
                onChange={handleInputChange}
                maxLength={5}
                required
              />
              {errors.fecha_tarjeta && <span style={{ color: 'red' }}>{errors.fecha_tarjeta}</span>}
              <input
                className="input-formModal"
                type="password"
                name="cvv"
                placeholder="CVV"
                value={clientData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                required
                style={{ marginRight: '10px' }}
              />
               {errors.cvv && <span style={{ color: 'red' }}>{errors.cvv}</span>}
              <button className="btnValue-formModal" type="submit">Confirmar Compra</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de la finalización de compra */}
      {isModalOpen && (
          <div className="modal">
            <div className="modal-contentPurchase">
              <p>{modalMessage}</p>
              <button className='btn-Finish' onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CartPage;