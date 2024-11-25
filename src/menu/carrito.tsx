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

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const [isFinalizing, setIsFinalizing] = useState(false); // Modo de finalizar compra
  const [colonias, setColonias] = useState<string[]>([]); // Opciones de colonias
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
            tipo_tarjeta: data.tipo_tarjeta || '',
            numero_tarjeta: data.numero_tarjeta || '',
            fecha_tarjeta: data.fecha_tarjeta || '',
            cvv: data.cvv || '',
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
      const response = await axios.get(`http://localhost:3000/api/codigo-postal/${codigoPostal}`);
      const { ciudad, colonias } = response.data;
      setClientData((prevData) => ({
        ...prevData,
        ciudad,
        colonia: colonias[0] || '',
      }));
      setColonias(colonias);
    } catch (error) {
      console.error('Error al obtener datos del código postal:', error);
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
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Finalizar compra
   // Finalizar compra
   const handleFinalizePurchase = async () => {
    try {
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

  return (
    <div>
      <h2>Tu Carrito de Compras</h2>
      {cartError && <p style={{ color: 'red' }}>{cartError}</p>}
      {cartItems.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <table>
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
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span>Sin imagen</span>
                    )}
                  </td>
                  <td>{item.nombre_producto}</td>
                  <td>{item.quantity}</td>
                  <td>${(Number(item.precio) || 0).toFixed(2)}</td>
                  <td>${((Number(item.precio) || 0) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleDecrementQuantity(item.carrito_producto_id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <button onClick={() => handleIncrementQuantity(item.carrito_producto_id)}>+</button>
                    <button onClick={() => handleRemoveItem(item.carrito_producto_id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total de Artículos: {totalItems}</h3>
          <h3>Monto Total: ${totalAmount.toFixed(2)}</h3>
          {!isFinalizing ? (
            <button onClick={() => setIsFinalizing(true)}>Finalizar Compra</button>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleFinalizePurchase(); }}>
              <h3>Opción de Entrega</h3>
              <select name="opcion_entrega" value={clientData.opcion_entrega} onChange={handleInputChange} required>
                <option value="domicilio">Domicilio</option>
                <option value="recoger">Recoger en tienda</option>
              </select>
              {clientData.opcion_entrega === 'domicilio' && (
                <>
                  <h3>Datos de Envío</h3>
                  <input
                    type="text"
                    name="codigo_postal"
                    placeholder="Código Postal"
                    value={clientData.codigo_postal}
                    onChange={handleInputChange}
                    required
                  />
                  <input type="text" name="ciudad" placeholder="Ciudad" value={clientData.ciudad} readOnly />
                  <select name="colonia" value={clientData.colonia} onChange={handleInputChange} required>
                    {colonias.map((colonia, index) => (
                      <option key={index} value={colonia}>
                        {colonia}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="calle"
                    placeholder="Calle"
                    value={clientData.calle}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="numero_exterior"
                    placeholder="Número Exterior"
                    value={clientData.numero_exterior}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="numero_interior"
                    placeholder="Número Interior (Opcional)"
                    value={clientData.numero_interior}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="descripcion_ubicacion"
                    placeholder="Descripción de Ubicación"
                    value={clientData.descripcion_ubicacion}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="numero_telefono"
                    placeholder="Número de Teléfono"
                    value={clientData.numero_telefono}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
              <h3>Datos de la Tarjeta</h3>
              <select
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
                type="text"
                name="numero_tarjeta"
                placeholder="Número de Tarjeta"
                value={clientData.numero_tarjeta}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="fecha_tarjeta"
                placeholder="Fecha de Expiración (MM/AA)"
                value={clientData.fecha_tarjeta}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={clientData.cvv}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Confirmar Compra</button>
            </form>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
