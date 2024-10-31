import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { syncCartToLocalStorage } from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncCartToLocalStorage),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
