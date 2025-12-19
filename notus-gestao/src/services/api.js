import axios from 'axios';

// Configura a URL base para não precisar repetir "http://localhost:8080/api" toda hora
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

// Interceptor: Antes de cada requisição, pega o token e anexa
api.interceptors.request.use((config) => {
  // Tenta pegar o token com a chave que definimos no Login
  const token = localStorage.getItem('notus_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;