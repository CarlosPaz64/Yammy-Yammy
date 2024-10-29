// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_LINK || 'http://localhost:3000/api', // Configura la URL de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
