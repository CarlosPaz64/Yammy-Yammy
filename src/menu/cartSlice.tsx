// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Producto } from './menu'; // Importa la interfaz Producto si está en otra carpeta

interface CartItem extends Producto {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Producto>) => {
      const itemIndex = state.items.findIndex(item => item.product_id === action.payload.product_id);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
