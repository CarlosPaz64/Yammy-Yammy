import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store';

interface CartItem extends Producto {
  quantity: number;
  carrito_producto_id: number;
  carrito_id?: number; // Agregamos carrito_id como opcional
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
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product: Producto, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      console.log("userId:", userId); // Verifica que no sea null


      if (!token || !userId) {
        throw new Error('El token de autenticación y el userId son requeridos');
      }

      const state = getState() as RootState;
      const carrito_id = state.cart.items.length > 0 ? state.cart.items[0].carrito_id : null;

      const response = await axiosInstance.post('/carrito/add-product', {
        client_id: Number(userId), // Correctamente usando client_id
        carrito_id, // carrito_id debe ser el id real del carrito
        product_id: product.product_id,
        cantidad: 1,
        token,
      });

      return {
        ...product,
        quantity: 1,
        carrito_id: response.data.carrito_id, // Asegúrate de devolver carrito_id si lo tienes en respuesta
        carrito_producto_id: response.data.carrito_producto_id,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Error al agregar producto al carrito.');
      }
      return rejectWithValue('Error desconocido al agregar producto.');
    }
  }
);


// Thunk para eliminar un producto
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (carrito_producto_id: number, { rejectWithValue }) => {
    try {
      if (!carrito_producto_id) {
        throw new Error("El parámetro 'carrito_producto_id' es obligatorio.");
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      await axiosInstance.delete(`/carrito/remove-product/${carrito_producto_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return carrito_producto_id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Error al eliminar el producto del carrito.'
        );
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido.');
    }
  }
);


// Thunk para reducir la cantidad de un producto
export const decrementQuantityAsync = createAsyncThunk(
  'cart/decrementQuantityAsync',
  async (
    { carrito_producto_id, cantidad }: { carrito_producto_id: number; cantidad: number },
    { rejectWithValue }
  ) => {
    try {
      if (!carrito_producto_id || !cantidad) {
        throw new Error("Los parámetros 'carrito_producto_id' y 'cantidad' son obligatorios.");
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      await axiosInstance.patch('/carrito/decrement-quantity', {
        carrito_producto_id,
        cantidad,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { carrito_producto_id, cantidad };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Error al reducir la cantidad del producto.'
        );
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido.');
    }
  }
);


// Thunk para aumentar la cantidad de un producto
export const incrementQuantityAsync = createAsyncThunk(
  'cart/incrementQuantityAsync',
  async (
    { carrito_id, product_id }: { carrito_id: number; product_id: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const client_id = localStorage.getItem('userId'); // Asegúrate de obtener el client_id
      
      if (!token || !client_id) {
        throw new Error('El token de autenticación y el client_id son requeridos.');
      }

      const cantidad = 1;
      await axiosInstance.post('/carrito/add-product', {
        carrito_id,
        product_id,
        client_id: Number(client_id), // Enviando client_id al backend
        cantidad,
        token,
      });

      return { product_id, cantidad };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Error al aumentar cantidad.');
      }
      return rejectWithValue('Error desconocido al aumentar cantidad.');
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
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const product = action.payload;
        const existingItemIndex = state.items.findIndex((item) => item.product_id === product.product_id);

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity += 1;
        } else {
          state.items.push(product);
        }

        state.totalItems += 1;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const carrito_producto_id = action.payload;
        state.items = state.items.filter((item) => item.carrito_producto_id !== carrito_producto_id);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
        const { carrito_producto_id, cantidad } = action.payload;
        const item = state.items.find((item) => item.carrito_producto_id === carrito_producto_id);
        if (item) {
          item.quantity -= cantidad;
          if (item.quantity <= 0) {
            state.items = state.items.filter((i) => i.carrito_producto_id !== carrito_producto_id);
          }
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        }
      })
      .addCase(incrementQuantityAsync.fulfilled, (state, action) => {
        const { product_id, cantidad } = action.payload;
        const item = state.items.find((item) => item.product_id === product_id);
        if (item) {
          item.quantity += cantidad;
          state.totalItems += cantidad;
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
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
