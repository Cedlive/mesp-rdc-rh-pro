
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// En production, remplacez localhost par l'IP de votre serveur MESP
const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api/v1' 
    : `http://${window.location.hostname}:5001/api/v1`;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mesp_auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const ApiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default ApiService;
