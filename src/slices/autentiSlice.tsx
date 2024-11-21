import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('authToken')), // Verifica si hay un token
  token: localStorage.getItem('authToken'),
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    
      // Opcional: Limpia el almacenamiento local
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    },
      initializeAuth(state, action: PayloadAction<string | null>) {
      console.log('Inicializando auth con token:', action.payload);
      state.token = action.payload; // Asigna el token al estado
      state.isAuthenticated = !!action.payload; // Actualiza isAuthenticated a true si el token existe
    }
    ,
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
