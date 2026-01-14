
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuration de base de l'instance Axios
// On utilise simplement '/api/v1'. 
// En DEV : Vite.config.ts redirigera vers localhost:5000
// En PROD : Nginx.conf redirigera vers le conteneur backend
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/v1', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Timeout un peu plus long pour la prod
});

// Intercepteur de requête : Injecte le Token JWT automatiquement si l'utilisateur est connecté
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mesp_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion centralisée des erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'API renvoie 401 (Non autorisé)
    if (error.response && error.response.status === 401) {
      // Optionnel : Déconnecter l'utilisateur si le token est expiré
      // localStorage.removeItem('mesp_auth_token');
      // window.location.href = '/login';
      console.warn('Session expirée ou non autorisée');
    }
    
    // Si l'API est inaccessible (Backend éteint)
    if (!error.response) {
      console.error("Le serveur backend est injoignable. Vérifiez qu'il tourne sur le port 5000.");
    }

    return Promise.reject(error);
  }
);

// Service générique pour les appels API
const ApiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default ApiService;
