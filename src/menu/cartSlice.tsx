import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store';

interface CartItem extends Producto {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  totalItems: number;
}

// Función para cargar el carrito desde localStorage
const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

// Estado inicial del carrito cargado desde localStorage
const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  status: 'idle',
  totalItems: loadCartFromLocalStorage().reduce((sum, item) => sum + item.quantity, 0),
};

// Thunk para agregar un producto al carrito en el backend
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product: Producto) => {
    const token = localStorage.getItem('authToken');
    
    // Enviar solicitud para agregar el producto al carrito
    const response = await axiosInstance.post('/carrito/add-product', {
      carrito_id: 1,
      product_id: product.product_id,
      cantidad: 1,
      token
    });

    return response.data; // Asumimos que esto devuelve el producto con cantidad actualizada en el carrito
  }
);

// Thunk para eliminar el producto del carrito sin afectar el stock

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (carritoProductoId: number) => {
    const token = localStorage.getItem('authToken');

    // Realiza la solicitud DELETE a la ruta correcta en el backend
    await axiosInstance.delete(`/carrito/remove-product/${carritoProductoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return carritoProductoId;
  }
);


// Slice del carrito
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      localStorage.removeItem('cart'); // Eliminar carrito de localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const product = action.payload;
        const itemIndex = state.items.findIndex((item) => item.product_id === product.product_id);
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        state.totalItems += 1;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        const itemIndex = state.items.findIndex((item) => item.product_id === productId);
        if (itemIndex >= 0) {
          // Eliminar el producto del carrito sin afectar el stock
          state.totalItems -= state.items[itemIndex].quantity;
          state.items.splice(itemIndex, 1);
        }
      });
  },
});

// Middleware para sincronizar el carrito con localStorage
export const syncCartToLocalStorage = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.cart.items));
  return result;
};

export const { clearCart } = cartSlice.actions;
export const selectTotalItems = (state: RootState) => state.cart.totalItems;

export default cartSlice.reducer;
