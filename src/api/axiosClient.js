import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const problem = error.response?.data;

    const message =
      problem?.detail ||
      problem?.title ||
      (status === 0 || !error.response
        ? 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.'
        : 'Ocurrió un error inesperado.');

    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default axiosClient;
