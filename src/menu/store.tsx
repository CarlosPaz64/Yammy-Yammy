import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import cartReducer from './cartSlice';
import productosReducer from './productosSlice';
import userReducer from '../slices/userSlice'; // Importa el reducer de usuario
import authReducer from '../slices/autentiSlice'; // Importa el reducer de autenticación

// Configuración de redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Solo persiste el carrito
};

// Combina todos los reducers
const rootReducer = combineReducers({
  cart: persistReducer(persistConfig, cartReducer), // Persiste el carrito
  productos: productosReducer, // Reducer para productos (no persistente)
  user: userReducer, // Reducer para el usuario
  auth: authReducer, // Reducer para autenticación
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desactiva verificaciones de serialización
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
