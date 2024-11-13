import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store';

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

interface ClientData {
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  ciudad: string;
  codigo_postal: string;
  descripcion_ubicacion: string;
  numero_telefono: string;
  tipo_tarjeta: string;
  numero_tarjeta: string;
  fecha_tarjeta: string;
  cvv: string;
}


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

      const carrito_id = response.data.carrito_id; // Verifica si carrito_id está presente
      console.log('carrito_id devuelto por la API:', carrito_id); // <-- Debug

      if (carrito_id) {
        localStorage.setItem('carritoId', carrito_id); // Guarda en localStorage
      } else {
        console.error('No se recibió carrito_id en la respuesta'); // <-- Debug
      }

      return {
        ...product,
        quantity: 1,
        carrito_id,
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
        `/carrito/decrement-quantity/${carrito_producto_id}`,
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

// Thunk para obtener los datos del cliente relacionados con el carrito
export const fetchCartClientDataAsync = createAsyncThunk<
  Partial<ClientData>,
  number,
  { rejectValue: string }
>(
  'cart/fetchCartClientDataAsync',
  async (clientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('El token de autenticación es requerido.');

      const response = await axiosInstance.get(`/carrito/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      let errorMessage = 'Error al obtener los datos del cliente.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error desconocido.';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para finalizar el carrito
export const finalizeCartAsync = createAsyncThunk<
  void,
  ClientData,
  { rejectValue: string }
>(
  'cart/finalizeCartAsync',
  async (clientData, { rejectWithValue, getState }) => {
    try {
      const carritoId = localStorage.getItem('carritoId');
      const client_id = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      if (!carritoId || !client_id || !token) {
        throw new Error('Faltan datos necesarios para finalizar la compra.');
      }

      const state = getState() as RootState;
      const totalAmount = state.cart.items.reduce(
        (total, item) => total + (item.precio || 0) * item.quantity,
        0
      );

      await axiosInstance.put(
        `/carrito/finalize/${carritoId}`,
        { ...clientData, client_id, precio_total: totalAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      let errorMessage = 'Error al finalizar la compra.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para validar la sesión y limpiar el carrito si no hay sesión activa
export const validateSessionAndClearCartAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'cart/validateSessionAndClearCartAsync',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        dispatch(clearCart()); // Limpiar carrito si no hay sesión activa
      }
    } catch (error) {
      return rejectWithValue('Error validando la sesión.');
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
      localStorage.removeItem('carritoId');
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
      })
      .addCase(finalizeCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.status = 'succeeded';
        localStorage.removeItem('carritoId');
      })
      .addCase(finalizeCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error al finalizar la compra.';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

// Selector para obtener el total de artículos en el carrito
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
