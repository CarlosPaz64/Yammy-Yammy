import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define la interfaz para un producto
export interface Producto {
  product_id: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio: number;
  categoria: string;
  stock: number;
  url_imagen: string;
  epoca?: string;
}

// Define la estructura del estado
interface ProductosState {
  productos: Producto[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: ProductosState = {
  productos: [],
  loading: false,
  error: null,
};

// Thunk para obtener los productos desde la API
export const fetchProductos = createAsyncThunk('productos/fetchProductos', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:3000/api/productos/por-categoria');
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    console.log('Productos recibidos:', data); // Verifica que los datos sean consistentes

    if (!Array.isArray(data)) {
      throw new Error('La respuesta de la API no es un array.');
    }

    return data.map((producto) => ({
      ...producto,
      precio: typeof producto.precio === 'string' ? parseFloat(producto.precio) : producto.precio,
    }));
  } catch (error: any) {
    return rejectWithValue(error.message || 'Error al obtener productos');
  }
});

// Slice para los productos
const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productosSlice.reducer;
