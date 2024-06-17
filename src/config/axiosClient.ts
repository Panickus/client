import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate de que esta URL sea correcta y no tenga un prefijo duplicado
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permitir el envío de cookies y credenciales
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token; // Usando x-auth-token en lugar de Bearer
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
