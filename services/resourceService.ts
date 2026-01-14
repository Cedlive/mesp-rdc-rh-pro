import ApiService from './api';
import { Announcement, TrainingSession, DocumentFile, Candidate, JobPost, PayrollEntry, Expense, Survey } from '../types';

const ResourceService = {
  getAnnouncements: () => ApiService.get<Announcement[]>('/announcements'),
  createAnnouncement: (data: Partial<Announcement>) => ApiService.post<Announcement>('/announcements', data),
  deleteAnnouncement: (id: string) => ApiService.delete(`/announcements/${id}`),

  getTrainings: () => ApiService.get<TrainingSession[]>('/trainings'),
  createTraining: (data: Partial<TrainingSession>) => ApiService.post<TrainingSession>('/trainings', data),

  getDocuments: () => ApiService.get<DocumentFile[]>('/documents'),
  createDocument: (data: Partial<DocumentFile>) => ApiService.post<DocumentFile>('/documents', data),

  getJobs: () => ApiService.get<JobPost[]>('/recruitment/jobs'),
  getCandidates: () => ApiService.get<Candidate[]>('/recruitment/candidates'),
  createCandidate: (data: Partial<Candidate>) => ApiService.post<Candidate>('/recruitment/candidates', data),

  getPayroll: () => ApiService.get<PayrollEntry[]>('/payroll'),
  generatePayroll: (month: string, year: number) => ApiService.post<PayrollEntry[]>('/payroll/generate', { month, year }),

  getExpenses: () => ApiService.get<Expense[]>('/expenses'),
  createExpense: (data: Partial<Expense>) => ApiService.post<Expense>('/expenses', data),

  getSurveys: () => ApiService.get<Survey[]>('/surveys'),
  createSurvey: (data: Partial<Survey>) => ApiService.post<Survey>('/surveys', data),
};

export default ResourceService;