
import { 
  Employee, Role, ModulePermission, PayrollEntry, Announcement, 
  LeaveRequest, DocumentFile, TrainingSession, Survey, 
  PerformanceReview, Expense, MedicalVoucher, JobPost, Candidate,
  DashboardTask, ServiceDepartment, ChatContact 
} from './types';
import { Landmark, UserCog, Stethoscope, Wallet, Users, Shield } from 'lucide-react';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'ADMIN_001',
    firstName: 'Admin',
    lastName: 'Nucleus',
    role: 'Administrateur',
    department: 'Direction Générale',
    email: 'admin@mesp.cd',
    phone: '+243 81 000 0000',
    avatar: 'https://ui-avatars.com/api/?name=Admin+MESP&background=0f172a&color=fff',
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
    insuranceNumber: 'MESP-2019-458'
  },
  {
    id: 'E002',
    firstName: 'Marie',
    lastName: 'Kapinga',
    role: 'Comptable',
    department: 'Finance',
    email: 'marie.k@mesp.cd',
    phone: '+243 82 444 5555',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256',
    status: 'Actif',
    joinDate: '2020-02-10',
    insuranceNumber: 'MESP-2020-012'
  }
];

const ALL_PERMS = (modules: string[]): ModulePermission[] => 
  modules.map(m => ({ module: m, canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }));

const MODULE_LIST = ['Employees', 'Payroll', 'Medical', 'Recruitment', 'Settings', 'Analytics', 'Communication'];

export const MOCK_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Contrôle total du noyau MESP',
    isSystem: true,
    usersCount: 1,
    permissions: ALL_PERMS(MODULE_LIST)
  },
  {
    id: 'drh',
    name: 'Directeur RH',
    description: 'Pilotage stratégique et validation finale',
    isSystem: true,
    usersCount: 0,
    permissions: ALL_PERMS(MODULE_LIST)
  },
  {
    id: 'comptable',
    name: 'Comptable',
    description: 'Gestion financière et cycle de paie',
    isSystem: true,
    usersCount: 1,
    permissions: [
      { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
      { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { module: 'Settings', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
    ]
  },
  {
    id: 'medecin',
    name: 'Médecin Conseil',
    description: 'Approbation des soins et bons médicaux',
    isSystem: true,
    usersCount: 0,
    permissions: [
      { module: 'Medical', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false }
    ]
  },
  {
    id: 'employe',
    name: 'Employé',
    description: 'Self-service agent',
    isSystem: true,
    usersCount: 154,
    permissions: [
      { module: 'Communication', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false }
    ]
  }
];

// Fixed MOCK_DEPARTMENTS to include roles and region to match ServiceDepartment interface
export const MOCK_DEPARTMENTS: ServiceDepartment[] = [
  { id: 'DIR', title: 'Direction Générale', icon: Landmark, roles: ['DG', 'Secrétaire'], region: 'Gombe' },
  { id: 'RH', title: 'Ressources Humaines', icon: UserCog, roles: ['DRH', 'Responsable Paie'], region: 'Gombe' },
  { id: 'FIN', title: 'Finance', icon: Wallet, roles: ['Directeur Financier', 'Comptable'], region: 'Gombe' },
  { id: 'MED', title: 'Médical', icon: Stethoscope, roles: ['Médecin Chef', 'Conseiller'], region: 'Limete' }
];

// Missing mock data added to fix compilation errors

export const MOCK_PAYROLL: PayrollEntry[] = [
  { id: 'P1', employeeId: 'E001', month: 'Octobre', year: 2023, baseSalaryCDF: 1500000, primeUSD: 200, primeCDF: 0, missionFeeUSD: 0, missionFeeCDF: 0, officeSuppliesFeeCDF: 0, medicinePurchaseFeeUSD: 0, fuelFeeCDF: 0, maintenanceFeeCDF: 0, totalCDF: 1550000, totalUSD: 200, status: 'Payé' }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'A1', title: 'Réunion générale', content: 'Discussion sur les objectifs Q4', date: '2023-11-20', author: 'DG', type: 'General' }
];

export const MOCK_TASKS: DashboardTask[] = [
  { id: 'T1', title: 'Valider les congés de Marie', status: 'Pending', type: 'Action' },
  { id: 'T2', title: 'Réviser le cycle de paie', status: 'Pending', type: 'Action' }
];

export const MOCK_LEAVES: LeaveRequest[] = [];
export const MOCK_DOCUMENTS: DocumentFile[] = [];
export const MOCK_TRAININGS: TrainingSession[] = [];
export const MOCK_SURVEYS: Survey[] = [];
export const MOCK_REVIEWS: PerformanceReview[] = [];
export const MOCK_EXPENSES: Expense[] = [];
export const MOCK_MEDICAL: MedicalVoucher[] = [
  { id: 'BC-7822', teacherId: 'E001', teacherName: 'Jean Ilunga', facilityName: 'Hôpital de Kinshasa', type: 'Consultation', amount: 25, currency: 'USD', status: 'Validé', date: '2023-11-12' },
  { id: 'BC-7823', teacherId: 'E002', teacherName: 'Marie Kapinga', facilityName: 'Pharmacie Centrale', type: 'Pharmacie', amount: 45, currency: 'USD', status: 'En attente', date: '2023-11-14' }
];

export const MOCK_JOBS: JobPost[] = [
  { id: 'J001', title: 'Assistant Comptable' }
];

export const MOCK_CANDIDATES: Candidate[] = [];

// Added MOCK_CHATS export for Communication page
export const MOCK_CHATS: ChatContact[] = [
  {
    id: 'group',
    name: 'MESP Général',
    avatar: 'https://ui-avatars.com/api/?name=MESP+General&background=0284c7&color=fff',
    lastMessage: 'Réunion du conseil à 14h00',
    type: 'group',
    lastMessageTime: new Date(),
    unreadCount: 3,
    onlineStatus: 'online'
  }
];
