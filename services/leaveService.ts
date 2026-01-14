import ApiService from './api';
import { LeaveRequest } from '../types';

const LeaveService = {
  getAll: () => ApiService.get<LeaveRequest[]>('/leaves'),
  create: (data: Partial<LeaveRequest>) => ApiService.post<LeaveRequest>('/leaves', data),
  updateStatus: (id: string, status: 'Approuvé' | 'Rejeté') => 
    ApiService.patch<LeaveRequest>(`/leaves/${id}/status`, { status })
};

export default LeaveService;