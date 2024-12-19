import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import axiosInstance from '../../api/axiosInstance';

const SECRET_KEY = 'tu_clave_secreta';

interface PedidoState {
  cliente: any | null;
  colonias: string[];
  ciudad: string | null;
  precio: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: PedidoState = {
  cliente: null,
  colonias: [],
  ciudad: null,
  precio: 100, // Precio inicial
  isLoading: false,
  error: null,
};

// AsyncThunk para obtener datos del cliente
export const fetchClienteData = createAsyncThunk(
  'pedido/fetchClienteData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/cliente/${userId}`);
      const cliente = response.data;

      return cliente;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener datos del cliente');
    }
  }
);

// AsyncThunk para obtener ciudad y colonias según el código postal
export const fetchCityAndColonies = createAsyncThunk(
  'pedido/fetchCityAndColonies',
  async (codigoPostal: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/codigo-postal/${codigoPostal}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener ciudad y colonias');
    }
  }
);

// AsyncThunk para enviar un pedido personalizado
export const enviarPedido = createAsyncThunk(
  'pedido/enviarPedido',
  async (pedidoData: any, { rejectWithValue }) => {
    try {
      // Encripta los datos del pedido
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(pedidoData), SECRET_KEY).toString();
      const formData = new FormData();
      formData.append('encryptedData', encryptedData);

      // Agregar imágenes al formData
      if (pedidoData.imagenes) {
        pedidoData.imagenes.forEach((imagen: File) => {
          formData.append('imagenes', imagen);
        });
      }

      const response = await axiosInstance.post('/pedido-personalizado', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar el pedido');
    }
  }
);

const pedidoSlice = createSlice({
  name: 'pedido',
  initialState,
  reducers: {
    calcularPrecio(state, action) {
      const { categoria, ciudad, cantidad } = action.payload;
      let precioBase;

      // Define el precio base por categoría
      switch (categoria) {
        case 'Postres':
          precioBase = 100;
          break;
        case 'Pasteles':
          precioBase = 200;
          break;
        case 'Brownies':
          precioBase = 150;
          break;
        case 'Galletas':
          precioBase = 50;
          break;
        default:
          precioBase = 100;
          break;
      }

      // Define el costo de envío según la ciudad
      const costoEnvio =
        ciudad === 'Mérida'
          ? 50
          : ciudad === 'Progreso'
          ? 75
          : ciudad === 'Umán'
          ? 80
          : ciudad === 'Kanasín'
          ? 85
          : 0;

      // Calcula el precio total
      state.precio = (precioBase * (cantidad || 1)) + costoEnvio;
    },
  },
  extraReducers: (builder) => {
    // Obtener datos del cliente
    builder.addCase(fetchClienteData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchClienteData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cliente = action.payload;
    });
    builder.addCase(fetchClienteData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Obtener ciudad y colonias
    builder.addCase(fetchCityAndColonies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCityAndColonies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ciudad = action.payload.ciudad;
      state.colonias = action.payload.colonias;
    });
    builder.addCase(fetchCityAndColonies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Enviar pedido
    builder.addCase(enviarPedido.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(enviarPedido.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(enviarPedido.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { calcularPrecio } = pedidoSlice.actions;
export default pedidoSlice.reducer;