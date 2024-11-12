import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import {
  removeFromCartAsync,
  incrementQuantityAsync,
  decrementQuantityAsync,
  finalizeCartAsync,
  validateSessionAndClearCartAsync,
  fetchCartClientDataAsync,
} from './cartSlice';
import axios from 'axios'; // Para consumir la API de códigos postales

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (total, item) => total + (Number(item.precio) || 0) * item.quantity,
    0
  );
  const dispatch = useDispatch<AppDispatch>();

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

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]); // Opciones de colonias basadas en el código postal

  useEffect(() => {
    dispatch(validateSessionAndClearCartAsync()); // Validar sesión y limpiar carrito si es necesario
  }, [dispatch]);

  const fetchZipCodeData = async (codigoPostal: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/codigo-postal/${codigoPostal}`);
      const { ciudad, colonias } = response.data;

      setClientData((prevData) => ({
        ...prevData,
        ciudad, // La ciudad es solo lectura, se actualiza automáticamente
        colonia: colonias[0] || '', // Por defecto, la primera colonia
      }));

      setColonias(colonias); // Actualiza el listado de colonias
    } catch (error) {
      console.error('Error al obtener datos del código postal:', error);
      setColonias([]); // Vacía las colonias en caso de error
      setClientData((prevData) => ({
        ...prevData,
        ciudad: '',
        colonia: '',
      }));
    }
  };

  useEffect(() => {
    if (clientData.codigo_postal.length === 5) {
      fetchZipCodeData(clientData.codigo_postal);
    }
  }, [clientData.codigo_postal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFinalizePurchase = async () => {
    try {
      const carritoId = localStorage.getItem('carritoId');
      if (!carritoId) {
        alert('No hay carrito activo. Por favor, agrega productos antes de finalizar la compra.');
        return;
      }
  
      const dataToSend = { ...clientData };
      if (clientData.opcion_entrega === 'recoger') {
        // Asignar valores de cadena vacía para evitar errores de tipo
        dataToSend.calle = '';
        dataToSend.numero_exterior = '';
        dataToSend.numero_interior = '';
        dataToSend.colonia = '';
        dataToSend.ciudad = '';
        dataToSend.codigo_postal = '';
        dataToSend.descripcion_ubicacion = '';
        dataToSend.numero_telefono = '';
      }
  
      console.log('Datos de cliente antes de finalizar:', dataToSend); // Depuración
      console.log('Carrito ID:', carritoId);
  
      // Llama a finalizeCartAsync con datos actualizados
      await dispatch(finalizeCartAsync(dataToSend)).unwrap();
      alert('Compra finalizada con éxito.');
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert(`Error al finalizar la compra: ${error}`);
    }
  };
  
  
  const handleRemoveItem = async (carrito_producto_id: number) => {
    try {
      await dispatch(removeFromCartAsync(carrito_producto_id)).unwrap();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleIncrementQuantity = async (carrito_id: number, product_id: number) => {
    try {
      await dispatch(incrementQuantityAsync({ carrito_id, product_id })).unwrap();
    } catch (error) {
      console.error('Error al incrementar la cantidad:', error);
    }
  };

  const handleDecrementQuantity = async (carrito_producto_id: number) => {
    try {
      await dispatch(decrementQuantityAsync({ carrito_producto_id, cantidad: 1 })).unwrap();
    } catch (error) {
      console.error('Error al reducir la cantidad:', error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (isFinalizing && userId) {
      dispatch(fetchCartClientDataAsync(Number(userId)))
        .unwrap()
        .then((data) => {
          setClientData((prevData) => ({
            ...prevData,
            ...data,
          }));
        })
        .catch((error) => {
          console.error('Error al obtener los datos del cliente:', error);
        });
    }
  }, [isFinalizing, dispatch]);

  const cartError = useSelector((state: RootState) => state.cart.error);


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
                    <button
                      onClick={() =>
                        handleIncrementQuantity(item.carrito_id || 0, item.product_id)
                      }
                    >
                      +
                    </button>
                    <button onClick={() => handleRemoveItem(item.carrito_producto_id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total de Artículos: {totalItems}</h3>
          <h3>Monto Total: ${totalAmount.toFixed(2)}</h3>

          <button onClick={() => setIsFinalizing(true)}>Finalizar Compra</button>

          {isFinalizing && (
            <form onSubmit={(e) => { e.preventDefault(); handleFinalizePurchase(); }}>
              <h3>Opción de Entrega</h3>
              <select
                name="opcion_entrega"
                value={clientData.opcion_entrega}
                onChange={handleInputChange}
                required
              >
                <option value="domicilio">Domicilio</option>
                <option value="recoger">Recoger en tienda</option>
              </select>

              {clientData.opcion_entrega === 'domicilio' ? (
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
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={clientData.ciudad}
                    readOnly
                  />
                  <select
                    name="colonia"
                    value={clientData.colonia}
                    onChange={handleInputChange}
                    required
                  >
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
              ) : (
                <p>
                  Recoge tu pedido en la sucursal: <br />
                  <strong>
                    Calle 85 S/N x 90 y 92 Santa Cruz Palomeque, Mérida, México.
                  </strong>
                </p>
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
    </div>
  );
};

export default CartPage;
