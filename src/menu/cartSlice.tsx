import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store'; // Asegúrate de utilizar RootState

interface CartItem extends Producto {
  quantity: number;
  carrito_producto_id: number;
  carrito_id: number;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  totalItems: number;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  totalItems: 0,
  error: null,
};

// Thunk para agregar un producto al carrito
export const addToCartAsync = createAsyncThunk<
  CartItem,
  Producto,
  { rejectValue: string }
>(
  'cart/addToCartAsync',
  async (product: Producto, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('El token de autenticación y el userId son requeridos');
      }

      const response = await axiosInstance.post('/carrito/add-product', {
        client_id: Number(userId),
        product_id: product.product_id,
        cantidad: 1,
        token,
      });

      return {
        ...product,
        quantity: 1,
        carrito_id: response.data.carrito_id,
        carrito_producto_id: response.data.carrito_producto_id,
      };
    } catch (error) {
      let errorMessage = 'Error desconocido al agregar producto.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error al agregar producto al carrito.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para eliminar un producto del carrito
export const removeFromCartAsync = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'cart/removeFromCartAsync',
  async (carrito_producto_id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      await axiosInstance.delete(`/carrito/remove-product/${carrito_producto_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return carrito_producto_id;
    } catch (error) {
      let errorMessage = 'Error desconocido al eliminar producto.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error al eliminar producto del carrito.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para reducir la cantidad de un producto
export const decrementQuantityAsync = createAsyncThunk<
  { carrito_producto_id: number; cantidad: number },
  { carrito_producto_id: number; cantidad: number },
  { rejectValue: string }
>(
  'cart/decrementQuantityAsync',
  async ({ carrito_producto_id, cantidad }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      await axiosInstance.patch(
        '/carrito/decrement-quantity',
        { carrito_producto_id, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { carrito_producto_id, cantidad };
    } catch (error) {
      let errorMessage = 'Error desconocido al reducir cantidad.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error al reducir cantidad.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para aumentar la cantidad de un producto
export const incrementQuantityAsync = createAsyncThunk<
  { product_id: number; cantidad: number },
  { carrito_id: number; product_id: number },
  { rejectValue: string }
>(
  'cart/incrementQuantityAsync',
  async ({ carrito_id, product_id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const client_id = localStorage.getItem('userId');

      if (!token || !client_id) {
        throw new Error('El token de autenticación y el client_id son requeridos.');
      }

      const cantidad = 1;
      const response = await axiosInstance.post('/carrito/add-product', {
        carrito_id,
        product_id,
        client_id: Number(client_id),
        cantidad,
        token,
      });

      return { product_id: response.data.product_id, cantidad };
    } catch (error) {
      let errorMessage = 'Error desconocido al aumentar cantidad.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error al aumentar cantidad.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      localStorage.removeItem('cart');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const product = action.payload;
        const existingItem = state.items.find(
          (item) => item.product_id === product.product_id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push(product);
        }

        state.totalItems += 1;
        state.status = 'succeeded';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.carrito_producto_id !== action.payload
        );
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.status = 'succeeded';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export default cartSlice.reducer;
