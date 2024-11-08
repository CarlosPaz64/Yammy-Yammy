import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import {
  removeFromCartAsync,
  incrementQuantityAsync,
  decrementQuantityAsync,
} from './cartSlice';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0); // Calcula el total directamente
  const totalAmount = cartItems.reduce(
    (total, item) => total + (Number(item.precio) || 0) * item.quantity,
    0
  ); // Calcula el monto total

  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveItem = async (carrito_producto_id: number) => {
    console.log(`Intentando eliminar producto con carrito_producto_id: ${carrito_producto_id}`);
    try {
      await dispatch(removeFromCartAsync(carrito_producto_id)).unwrap();
      console.log(`Producto con ID ${carrito_producto_id} eliminado del carrito.`);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleIncrementQuantity = async (carrito_id: number, product_id: number) => {
    console.log(`Incrementando cantidad: carrito_id: ${carrito_id}, product_id: ${product_id}`);
    try {
      await dispatch(incrementQuantityAsync({ carrito_id, product_id })).unwrap();
      console.log(`Cantidad incrementada para el producto con ID ${product_id}.`);
    } catch (error) {
      console.error('Error al incrementar la cantidad:', error);
    }
  };

  const handleDecrementQuantity = async (carrito_producto_id: number) => {
    console.log(`Intentando reducir cantidad de carrito_producto_id: ${carrito_producto_id}`);
    try {
      await dispatch(decrementQuantityAsync({ carrito_producto_id, cantidad: 1 })).unwrap();
      console.log(`Cantidad reducida para el producto con carrito_producto_id ${carrito_producto_id}.`);
    } catch (error) {
      console.error('Error al reducir la cantidad:', error);
    }
  };

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
              {cartItems.map((item) => {
                console.log('Renderizando producto:', item);
                return (
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
                );
              })}
            </tbody>
          </table>
          <h3>Total de Artículos: {totalItems}</h3>
          <h3>Monto Total: ${totalAmount.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
