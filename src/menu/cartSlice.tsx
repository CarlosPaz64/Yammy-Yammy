// src/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';

interface CartItem extends Producto {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CartState = {
  items: [],
  status: 'idle',
};

// Thunk para agregar un producto al carrito en el backend
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product: Producto) => {
    const response = await axiosInstance.post('/carrito/add-product', {
      carrito_id: 1, // Usa el carrito_id del usuario
      product_id: product.product_id,
      cantidad: 1,
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
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
