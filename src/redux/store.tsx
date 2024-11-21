import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/autentiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // Reducer para el usuario
    auth: authReducer, // Reducer para autenticación
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
