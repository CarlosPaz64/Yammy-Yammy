import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { Producto } from './menu';
import { RootState } from './store';

interface CartItem extends Producto {
  quantity: number;
  carrito_producto_id: number; // Identificador único para cada producto en el carrito
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

    // Retorna el producto con el carrito_producto_id y cantidad 1
    return { ...product, quantity: 1, carrito_producto_id: response.data.carrito_producto_id };
  }
);

// Thunk para eliminar el producto del carrito y restablecer el stock
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (carritoProductoId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/carrito/remove-product/${carritoProductoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return carritoProductoId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar producto del carrito');
    }
  }
);

// Thunk para reducir la cantidad de un producto en el carrito
export const decrementQuantityAsync = createAsyncThunk(
  'cart/decrementQuantityAsync',
  async ({ carritoProductoId, cantidad }: { carritoProductoId: number; cantidad: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.patch('/carrito/decrement-quantity', {
        carrito_producto_id: carritoProductoId,
        cantidad,
        token
      });
      return { carritoProductoId, cantidad };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al reducir la cantidad del producto');
    }
  }
);

// Thunk para incrementar la cantidad de un producto y actualizar en el backend
export const incrementQuantityAsync = createAsyncThunk(
  'cart/incrementQuantityAsync',
  async ({ carrito_id, productId }: { carrito_id: number; productId: number }) => {
    const token = localStorage.getItem('authToken');
    const cantidad = 1; // Incrementar en 1

    await axiosInstance.post('/carrito/add-product', {
      carrito_id,
      product_id: productId,
      cantidad,
      token
    });

    return { productId, cantidad };
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
      localStorage.removeItem('cart');
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
          state.items.push(product);
        }
        state.totalItems += 1;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const carritoProductoId = action.payload;
        state.items = state.items.filter((item) => item.carrito_producto_id !== carritoProductoId);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
        const { carritoProductoId, cantidad } = action.payload;
        const item = state.items.find((item) => item.carrito_producto_id === carritoProductoId);
        if (item) {
          item.quantity -= cantidad;
          if (item.quantity <= 0) {
            state.items = state.items.filter((i) => i.carrito_producto_id !== carritoProductoId);
          }
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        }
      })
      .addCase(incrementQuantityAsync.fulfilled, (state, action) => {
        const { productId, cantidad } = action.payload;
        const item = state.items.find((item) => item.product_id === productId);
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

// Exportar las acciones y el middleware
export const { clearCart } = cartSlice.actions;
export const selectTotalItems = (state: RootState) => state.cart.totalItems;

export default cartSlice.reducer;