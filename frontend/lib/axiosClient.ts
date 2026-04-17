/**
 * Cliente Global de Axios
 * ========================
 * Configuración centralizada de Axios para la aplicación Next.js.
 * 
 * Responsabilidades:
 * - Establecer baseURL de la API
 * - Gestionar interceptores de request y response
 * - Automatizar autenticación con tokens JWT
 * - Manejar errores consistentemente
 * 
 * Uso:
 * import { axiosClient } from '@/lib/axiosClient';
 * await axiosClient.get('/ruta');
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Crear instancia de axios con configuración base
const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://darksiders.shop/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request
 * ----------------------
 * Se ejecuta antes de cada solicitud HTTP.
 * Responsabilidades:
 * - Leer token JWT desde localStorage
 * - Agregar automáticamente header Authorization si existe token
 * - Permitir que la solicitud continúe con configuración completa
 */
axiosClient.interceptors.request.use(
  (config) => {
    // Solo ejecutar en el navegador (cliente), no en servidor
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Si existe token, agregarlo al header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  // Manejar error en la fase de request (raramente ocurre)
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * ----------------------
 * Se ejecuta después de cada respuesta HTTP.
 * Responsabilidades:
 * - Validar respuestas exitosas (2xx)
 * - Manejar errores HTTP comunes
 * - Redirigir a login si token está expirado (401)
 * - Propagar errores con información clara
 */
axiosClient.interceptors.response.use(
  // Respuesta exitosa: pasar datos directamente
  (response) => response,
  
  // Error en respuesta
  (error: AxiosError) => {
    // Error de autenticación: token expirado o inválido
    if (error.response?.status === 401) {
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        // Redirigir a login (opcional, puede manejarse en el componente)
        window.location.href = '/auth/login';
      }
    }
    
    // Error de servidor (5xx)
    if (error.response?.status === 500) {
      console.error('Error interno del servidor:', error.response.data);
    }
    
    // Error de cliente (4xx)
    if (error.response?.status === 400) {
      console.warn('Solicitud inválida:', error.response.data);
    }
    
    // Propagar el error para manejo en componentes
    return Promise.reject(error);
  }
);

export default axiosClient;
