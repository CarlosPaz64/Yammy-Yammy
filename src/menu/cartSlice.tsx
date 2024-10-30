// src/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store';

interface CartItem extends Producto {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  totalItems: number; // Nuevo contador de productos totales en el carrito
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  totalItems: 0,
};

// Thunk para agregar un producto al carrito en el backend
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product: Producto) => {
    const token = localStorage.getItem('authToken'); // Obtener el token desde localStorage
    const response = await axiosInstance.post('/carrito/add-product', {
      carrito_id: 1, // Usa el carrito_id del usuario
      product_id: product.product_id,
      cantidad: 1,
      token
    });
    return response.data;
  }
);

// Thunk para obtener los productos del carrito
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (carrito_id: number) => {
  const response = await axiosInstance.get(`/carrito/${carrito_id}/products`);
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0; // Reiniciar el contador
    },
    removeFromCart: (state, action: PayloadAction<number>) => { // Nueva acción `removeFromCart`
      const itemIndex = state.items.findIndex((item) => item.product_id === action.payload);
      if (itemIndex >= 0) {
        state.totalItems -= state.items[itemIndex].quantity;
        state.items.splice(itemIndex, 1);
      }
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
        state.totalItems += 1; // Incrementar el contador total de productos
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalItems = action.payload.reduce((sum: number, item: CartItem) => sum + item.quantity, 0); // Calcular el total de productos
      });
  },
});

export const { clearCart, removeFromCart } = cartSlice.actions;

// Selector para obtener el total de productos en el carrito
export const selectTotalItems = (state: RootState) => state.cart.totalItems;

export default cartSlice.reducer;
