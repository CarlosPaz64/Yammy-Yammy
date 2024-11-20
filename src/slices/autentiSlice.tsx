import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
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
    },
    initializeAuth(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
