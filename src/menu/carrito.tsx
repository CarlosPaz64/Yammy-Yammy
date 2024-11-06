import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { removeFromCartAsync } from './cartSlice';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCartAsync(productId)); 
  };

  return (
    <div>
      <h2>Tu Carrito de Compras</h2>
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
            <tr key={item.product_id}>
              <td>{item.nombre_producto}</td>
              <td>{item.quantity}</td>
              <td>${(Number(item.precio) || 0).toFixed(2)}</td>
              <td>${((Number(item.precio) || 0) * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoveItem(item.product_id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>
        Total de Artículos: {cartItems.reduce((total, item) => total + item.quantity, 0)}
      </h3>
      <h3>
        Monto Total: $
        {cartItems.reduce((total, item) => total + (Number(item.precio) || 0) * item.quantity, 0).toFixed(2)}
      </h3>
    </div>
  );
};

export default CartPage;
