import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './productosSlice';
import { RootState } from './store';
import CryptoJS from 'crypto-js';

// Clave secreta para encriptar los datos (debe mantenerse segura)
const SECRET_KEY = 'tu_clave_secreta';

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
  { carrito_producto_id: number; cantidad: number }, // Tipo de datos retornados
  { carrito_producto_id: number; cantidad: number }, // Tipo de argumentos pasados al thunk
  { rejectValue: string } // Tipo de valor en caso de error
>(
  'cart/incrementQuantityAsync',
  async ({ carrito_producto_id, cantidad }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      // Realiza la petición PATCH para incrementar la cantidad
      const response = await axiosInstance.patch(
        `/carrito/increment-quantity/${carrito_producto_id}`,
        { cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { carrito_producto_id: response.data.carrito_producto_id, cantidad };
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
    console.log('Thunk decrementQuantityAsync disparado:', { carrito_producto_id, cantidad }); // Agregado
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('El token de autenticación es requerido.');
      }

      await axiosInstance.patch(
        `/carrito/decrement-quantity/${carrito_producto_id}`,
        { cantidad },
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

      // Crear el objeto a encriptar
      const dataToEncrypt = {
        ...clientData,
        client_id,
        precio_total: totalAmount,
      };

      // Encriptar los datos
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        SECRET_KEY
      ).toString();
      console.log('Datos encriptados enviados:', encryptedData);

      // Crear FormData para enviar los datos encriptados
      const formData = new FormData();
      formData.append('encryptedData', encryptedData);

      await axiosInstance.put(`/carrito/finalize/${carritoId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      let errorMessage = 'Error al finalizar la compra.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para obtener el carrito pendiente
export const fetchPendingCartWithProductsAsync = createAsyncThunk<
  { carrito_id: number; items: CartItem[] },
  void,
  { rejectValue: string }
>('cart/fetchPendingCartWithProductsAsync', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('El token de autenticación es requerido');
    }

    // Paso 1: Obtener el carrito pendiente
    const carritoResponse = await axiosInstance.get('/carrito/pending', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const carrito = carritoResponse.data;
    const carritoId = carrito.carrito_id;

    // Paso 2: Obtener los productos del carrito
    const productosResponse = await axiosInstance.get(`/carrito/${carritoId}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      carrito_id: carritoId,
      items: productosResponse.data, // Productos asociados al carrito
    };
  } catch (error) {
    let errorMessage = 'Error al recuperar el carrito pendiente con productos.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || 'Error desconocido.';
    }
    return rejectWithValue(errorMessage);
  }
});

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

// Thunk para llamar a los  prodcutos del carrito
export const fetchCartProductsAsync = createAsyncThunk<
  Array<CartItem & { cantidad: number }>, // Indica que `cantidad` está presente temporalmente
  number, 
  { rejectValue: string }
>(
  'cart/fetchCartProductsAsync',
  async (carritoId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('El token de autenticación es requerido.');

      const response = await axiosInstance.get(`/carrito/${carritoId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data; // La API devuelve `cantidad`
    } catch (error) {
      let errorMessage = 'Error al cargar los productos del carrito.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ?? 'Error desconocido.';
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
      localStorage.removeItem('carritoId');
    },
    clearError: (state) => {
      state.error = null; // Limpia el error
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
      .addCase(incrementQuantityAsync.fulfilled, (state, action) => {
        const { carrito_producto_id, cantidad } = action.payload;
        const item = state.items.find((item) => item.carrito_producto_id === carrito_producto_id);
        if (item) {
          item.quantity += cantidad; // Actualizar la cantidad directamente en el estado
        }
      })       
      .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
        console.log('decrementQuantityAsync.fulfilled ejecutado:', action.payload);
        const { carrito_producto_id, cantidad } = action.payload;
        const item = state.items.find((item) => item.carrito_producto_id === carrito_producto_id);
        if (item && item.quantity > cantidad) {
          item.quantity -= cantidad;
        } else if (item && item.quantity === cantidad) {
          state.items = state.items.filter((item) => item.carrito_producto_id !== carrito_producto_id);
        }
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
      })
      .addCase(fetchCartProductsAsync.pending, (state) => {
        state.status = 'loading'; // Indica que la solicitud está en proceso
        state.error = null; // Limpia cualquier error previo
      })
      .addCase(fetchCartProductsAsync.fulfilled, (state, action) => {
        state.items = action.payload.map((item) => ({
          ...item,
          quantity: item.cantidad, // Mapear `cantidad` a `quantity`
        }));
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.status = 'succeeded';
        state.error = null; // Asegura que no haya errores
      })
      .addCase(fetchCartProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error al cargar los productos del carrito.';
      })
      .addCase(fetchPendingCartWithProductsAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('carritoId', String(action.payload.carrito_id));
      })
      .addCase(fetchPendingCartWithProductsAsync.rejected, (state) => {
        state.items = [];
        state.totalItems = 0;
      });      
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

// Selector para obtener el total de artículos en el carrito
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
