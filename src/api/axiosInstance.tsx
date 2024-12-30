import axios, { AxiosHeaders } from 'axios';

const API_LINK = import.meta.env.VITE_API_LINK || 'https://yamy-yamy-api.vercel.app/api';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_LINK,
});

// Interceptor para incluir el token automáticamente en cada solicitud
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Crear un objeto AxiosHeaders
    const headers = new AxiosHeaders();
    headers.set('Authorization', `Bearer ${token}`);

    config.headers = headers;
  }
  return config;
});

export default axiosInstance;