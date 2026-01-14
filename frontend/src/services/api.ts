
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Utilisation de l'URL absolue ou relative via proxy Vite
const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api/v1' 
    : `http://${window.location.hostname}:5001/api/v1`;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // Timeout réduit pour une meilleure réactivité en cas d'erreur
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('mesp_auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error("❌ ERREUR RÉSEAU : Le serveur backend MESP est injoignable.");
            // Déclencher une alerte UI globale si possible
            window.dispatchEvent(new CustomEvent('app-alert', { 
                detail: { 
                    title: 'Serveur hors-ligne', 
                    message: 'La liaison avec le noyau est interrompue. Mode déconnecté actif.', 
                    type: 'error' 
                } 
            }));
        }
        return Promise.reject(error);
    }
);

const ApiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default ApiService;
