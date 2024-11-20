import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  nombre_cliente: string;
  apellido_cliente: string;
  email: string;
}

const initialState: UserState = {
  nombre_cliente: '',
  apellido_cliente: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.nombre_cliente = action.payload.nombre_cliente;
      state.apellido_cliente = action.payload.apellido_cliente;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.nombre_cliente = '';
      state.apellido_cliente = '';
      state.email = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
