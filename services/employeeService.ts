import ApiService from './api';
import { Employee } from '../types';

const EmployeeService = {
  getAll: () => ApiService.get<Employee[]>('/employees'),
  getById: (id: string) => ApiService.get<Employee>(`/employees/${id}`),
  create: (data: Partial<Employee>) => ApiService.post<Employee>('/employees', data),
  updateStatus: (id: string, status: 'Actif' | 'Inactif' | 'Mission') => 
    ApiService.patch<Employee>(`/employees/${id}/status`, { status }),
  delete: (id: string) => ApiService.delete(`/employees/${id}`)
};

export default EmployeeService;