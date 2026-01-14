
import { Employee, PayrollEntry, Mission, ServiceDepartment, MedicalVoucher, Role, DashboardTask, Announcement, CalendarEvent, SocialPost, ChatContact, Message, InternalEmail, LeaveRequest, JobPost, Candidate, PerformanceReview, TrainingSession, DocumentFile, Expense, Survey } from './types';
import { Landmark, UserCog, Wallet, Stethoscope, Users, Shield } from 'lucide-react';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'ADMIN_001',
    firstName: 'Directeur',
    lastName: 'Général',
    role: 'Administrateur',
    department: 'Direction Générale',
    email: 'admin@mesp.cd',
    phone: '+243 81 000 0000',
    avatar: 'https://ui-avatars.com/api/?name=DG+MESP&background=0f172a&color=fff',
    status: 'Actif',
    joinDate: '2010-01-01',
    password: 'admin',
    insuranceNumber: 'MESP-DG-001'
  },
  {
    id: 'E001',
    firstName: 'Jean',
    lastName: 'Ilunga',
    role: 'Responsable RH',
    department: 'Ressources Humaines',
    email: 'jean.ilunga@mesp-rdc.cd',
    phone: '+243 82 111 2222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256',
    status: 'Actif',
    joinDate: '2019-05-12',
    insuranceNumber: 'MESP-2019-458',
    lastLocation: { lat: -4.325, lng: 15.322, timestamp: '10:45', address: 'Kinshasa, Gombe', signalStrength: 'strong' }
  },
  {
    id: 'E002',
    firstName: 'Émilie',
    lastName: 'Lefèvre',
    role: 'Médecin Conseil',
    department: 'Médical',
    email: 'e.lefevre@mesp.cd',
    phone: '+243 81 000 0004',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256',
    status: 'Mission',
    joinDate: '2020-02-05',
    insuranceNumber: 'MESP-2020-004',
    lastLocation: { lat: -1.674, lng: 29.228, timestamp: '09:30', address: 'Goma, Nord-Kivu', signalStrength: 'medium' }
  }
];

export const MOCK_PAYROLL: PayrollEntry[] = [
  { id: 'P1', employeeId: 'E001', month: 'Octobre', year: 2023, baseSalaryCDF: 1500000, primeUSD: 200, primeCDF: 0, missionFeeUSD: 0, totalCDF: 1500000, totalUSD: 200, status: 'Payé' },
  { id: 'P2', employeeId: 'E002', month: 'Octobre', year: 2023, baseSalaryCDF: 1800000, primeUSD: 350, primeCDF: 0, missionFeeUSD: 100, totalCDF: 1800000, totalUSD: 450, status: 'En attente' }
];

export const MOCK_DEPARTMENTS: ServiceDepartment[] = [
  { id: 'DIR', title: 'Direction Générale', icon: Landmark, roles: ['DG', 'Secrétaire'], region: 'Kinshasa - Siège' },
  { id: 'RH', title: 'Ressources Humaines', icon: UserCog, roles: ['DRH', 'Paie'], region: 'Kinshasa' },
  { id: 'FIN', title: 'Finance', icon: Wallet, roles: ['Daf', 'Comptable'], region: 'Kinshasa' },
  { id: 'MED', title: 'Médical', icon: Stethoscope, roles: ['Médecin Chef'], region: 'Limete' }
];

export const MOCK_MISSIONS: Mission[] = [
  { id: 'MIS-001', agentName: 'Émilie Lefèvre', destination: 'Goma', startDate: '2024-01-10', endDate: '2024-01-20', purpose: 'Assistance Médicale Urgente', status: 'En cours' }
];

export const MOCK_MEDICAL: MedicalVoucher[] = [
  { id: 'BC-7822', teacherName: 'Jean Ilunga', facilityName: 'Hôpital de Kinshasa', type: 'Consultation', amount: 25, status: 'Validé', date: '2023-11-12' }
];

// Fix: Add missing MOCK constants
export const MOCK_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès total au système',
    isSystem: true,
    usersCount: 1,
    permissions: [
        { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
        { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
        { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
        { module: 'Settings', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
        { module: 'Analytics', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }
    ]
  },
  {
      id: 'hr_manager',
      name: 'Responsable RH',
      description: 'Gestion du personnel et paie',
      isSystem: true,
      usersCount: 1,
      permissions: [
          { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
          { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
          { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false }
      ]
  },
  {
      id: 'employee',
      name: 'Employé',
      description: 'Accès limité à l\'espace personnel',
      isSystem: true,
      usersCount: 100,
      permissions: [
          { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
      ]
  }
];

export const MOCK_TASKS: DashboardTask[] = [
  { id: '1', title: 'Valider les notes de frais de Pierre', status: 'Pending', type: 'Action' },
  { id: '2', title: 'Entretien de recrutement : Sarah M.', status: 'Pending', type: 'Action' },
  { id: '3', title: 'Mettre à jour la grille salariale', status: 'Completed', type: 'Action' }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Nouvelle Campagne Médicale', content: 'Une nouvelle campagne de vaccination démarre lundi.', date: '2023-11-20', type: 'Urgent' },
  { id: '2', title: 'Fermeture Bureaux', content: 'Les bureaux seront fermés le vendredi 24 pour maintenance.', date: '2023-11-18', type: 'General' }
];

export const MOCK_EVENTS: CalendarEvent[] = [];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [];

export const MOCK_CHATS: ChatContact[] = [];

export const MOCK_MESSAGES: Message[] = [];

export const MOCK_EMAILS: InternalEmail[] = [];

export const MOCK_LEAVES: LeaveRequest[] = [];

export const MOCK_JOBS: JobPost[] = [
    { id: 'J1', title: 'Comptable Senior' },
    { id: 'J2', title: 'Médecin Généraliste' }
];

export const MOCK_CANDIDATES: Candidate[] = [];

export const MOCK_REVIEWS: PerformanceReview[] = [];

export const MOCK_TRAININGS: TrainingSession[] = [];

export const MOCK_DOCUMENTS: DocumentFile[] = [];

export const MOCK_EXPENSES: Expense[] = [];

export const MOCK_SURVEYS: Survey[] = [];
