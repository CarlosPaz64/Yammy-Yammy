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
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveItem = (carrito_producto_id: number) => {
    dispatch(removeFromCartAsync(carrito_producto_id));
  };

  const handleIncrementQuantity = (carrito_id: number, product_id: number) => {
    dispatch(incrementQuantityAsync({ carrito_id, product_id }));
  };

  const handleDecrementQuantity = (carrito_producto_id: number) => {
    dispatch(decrementQuantityAsync({ carrito_producto_id, cantidad: 1 }));
  };

  return (
    <div>
      <h2>Tu Carrito de Compras</h2>
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
                      onClick={() => handleIncrementQuantity(1, item.product_id)} // Asume un carrito_id de ejemplo
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
          <h3>
            Total de Artículos:{' '}
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </h3>
          <h3>
            Monto Total: $
            {cartItems
              .reduce(
                (total, item) => total + (Number(item.precio) || 0) * item.quantity,
                0
              )
              .toFixed(2)}
          </h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
