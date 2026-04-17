import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://darksiders.shop/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR FIX
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;