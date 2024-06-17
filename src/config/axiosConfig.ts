import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir un interceptor para incluir el token de autenticación
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Asume que el token se almacena en localStorage
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
