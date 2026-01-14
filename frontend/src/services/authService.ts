
import ApiService from './api';
import { Employee } from '../types';

interface LoginResponse {
  user: Employee;
  token: string;
}

const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Appel au backend
    const response = await ApiService.post<LoginResponse>('/auth/login', { email, password });
    
    // Stockage du token
    if (response.data.token) {
      localStorage.setItem('mesp_auth_token', response.data.token);
      localStorage.setItem('mesp_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData: Partial<Employee>) => {
    return ApiService.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('mesp_auth_token');
    localStorage.removeItem('mesp_user');
    window.location.href = '/login';
  },

  getCurrentUser: (): Employee | null => {
    const userStr = localStorage.getItem('mesp_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('mesp_auth_token');
  }
};

export default AuthService;
