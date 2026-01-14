
import { Employee, Role, ModulePermission, PayrollEntry, Announcement, LeaveRequest, DocumentFile, TrainingSession, Survey, PerformanceReview, Expense, MedicalVoucher, JobPost, Candidate, DashboardTask, ServiceDepartment, ChatContact, CalendarEvent, CustomFieldDefinition, SocialPost, SocialStory, Message, InternalEmail, AccessDevice } from './types';
import { 
  Briefcase, Calculator, ShieldCheck, UserCheck, Wrench, Truck, Network, Mail, 
  Calendar, FileText, FileSearch, CheckSquare, RefreshCw, CreditCard, Database, 
  FileCheck, UserPlus, Banknote, GraduationCap, TrendingUp, Palmtree, Package, 
  Lock, Sparkles, BookOpen, Landmark, PieChart, Gavel, FileSignature, 
  MessageCircle, Eye, Wifi, Code, Headphones, ShieldAlert, Activity, 
  ClipboardCheck, HeartPulse, Smile, Phone, Hammer, Map, Book, UserCog,
  Building2, Wallet, Scale, Monitor, Stethoscope
} from 'lucide-react';

export const MOCK_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  { id: 'cf_tshirt', label: 'Taille T-shirt', type: 'select', module: 'employees', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'cf_remote', label: 'Jours Télétravail', type: 'number', module: 'employees' },
  { id: 'cf_emergency', label: 'Contact Urgence', type: 'text', module: 'employees' },
  { id: 'cf_workstation', label: 'Poste de travail', type: 'text', module: 'employees' },
  { id: 'cf_availability', label: 'Délai préavis', type: 'text', module: 'recruitment' },
  { id: 'cf_referral', label: 'Recommandé par', type: 'text', module: 'recruitment' },
  { id: 'cf_salary_exp', label: 'Prétention Salariale', type: 'number', module: 'recruitment' }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'ADMIN_001',
    firstName: 'Admin',
    lastName: 'Principal',
    role: 'Directeur RH',
    department: 'Direction Générale',
    affiliation: 'MESP Siège',
    email: 'admin@mesp.cd',
    phone: '+243 81 000 0000',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Actif',
    joinDate: '2010-01-01',
    password: 'admin',
    insuranceNumber: 'MESP-2010-001',
    birthDate: '1975-05-12'
  },
  {
    id: 'E001',
    firstName: 'Jean',
    lastName: 'Ilunga',
    role: 'Représentant RH',
    department: 'RH',
    affiliation: 'MESP Kinshasa',
    email: 'jean.ilunga@mesp.cd',
    phone: '+243 82 111 2222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256',
    status: 'Actif',
    joinDate: '2019-05-12',
    insuranceNumber: 'MESP-2019-458',
    lastLocation: {
      lat: -4.325,
      lng: 15.322,
      timestamp: '10:45',
      address: 'Kinshasa, Gombe',
      signalStrength: 'strong'
    }
  },
  {
    id: 'E002',
    firstName: 'Hélène',
    lastName: 'Caron',
    role: 'Sales Development',
    department: 'Direction Générale',
    affiliation: 'MESP Limete',
    email: 'h.caron@mesp.cd',
    phone: '+243 81 000 0002',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Actif',
    joinDate: '2022-06-10'
  },
  {
    id: 'E003',
    firstName: 'Pierre',
    lastName: 'Dubois',
    role: 'Expert Paie',
    department: 'Finance',
    affiliation: 'MESP Siège',
    email: 'p.dubois@mesp.cd',
    phone: '+243 81 000 0003',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Actif',
    joinDate: '2019-11-20'
  },
  {
    id: 'E004',
    firstName: 'Émilie',
    lastName: 'Lefèvre',
    role: 'Médecin Conseil',
    department: 'Médical',
    affiliation: 'MESP Gombe',
    email: 'e.lefevre@mesp.cd',
    phone: '+243 81 000 0004',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Mission',
    joinDate: '2020-02-05',
    lastLocation: {
      lat: -1.674,
      lng: 29.228,
      timestamp: '09:30',
      address: 'Goma, Nord-Kivu',
      signalStrength: 'medium'
    }
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A1',
    title: 'Final de tennis 2024 🎾',
    content: 'Rejoignez-nous au centre sportif pour la finale annuelle ! Buffet et rafraîchissements offerts.',
    date: '3 avril 2023',
    author: 'Hélène Caron',
    type: 'Event',
    isPinned: true,
    mediaUrl: 'https://images.unsplash.com/photo-1595435064212-0104e8244b21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  },
  {
    id: 'A2',
    title: 'Félicitations Nathalie ! 🎉',
    content: 'Toute l\'équipe souhaite un excellent anniversaire à Nathalie Faure. Profite bien de ta journée !',
    date: '3 avril 2023',
    author: 'Hélène Caron',
    type: 'General',
    mediaUrl: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    mediaType: 'image'
  }
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'E1', title: 'Tournoi de tennis', date: '11 Avr', time: '18:30', type: 'Event', color: 'bg-indigo-500' },
  { id: 'E2', title: 'Tournoi de football', date: '16 Mai', time: '18:30', type: 'Event', color: 'bg-emerald-500' },
  { id: 'E3', title: 'Fête 10 ans MESP', date: '18 Mai', time: '20:00', type: 'Event', color: 'bg-amber-500' }
];

export const MOCK_TASKS: DashboardTask[] = [
  { id: 'T1', title: "Ajout d'un employé à la plateforme HCM", type: 'Action', status: 'Pending', assignedTo: 'ADMIN_001' },
  { id: 'T2', title: "Demander un téléphone d'entreprise", type: 'Request', status: 'Pending', assignedTo: 'ADMIN_001' },
  { id: 'T3', title: "Ordinateur de demande", type: 'Request', status: 'Completed', assignedTo: 'ADMIN_001' }
];

export const MOCK_PAYROLL: PayrollEntry[] = [
  { id: 'P1', employeeId: 'E003', month: 'Janvier', year: 2024, baseSalaryCDF: 1500000, primeUSD: 200, primeCDF: 0, missionFeeUSD: 0, missionFeeCDF: 0, leaveFeeUSD: 0, trainingFeeUSD: 0, workFeeCDF: 0, operatingFeeUSD: 0, totalCDF: 1500000, totalUSD: 200, status: 'Payé' },
  { id: 'P2', employeeId: 'E001', month: 'Janvier', year: 2024, baseSalaryCDF: 1200000, primeUSD: 150, primeCDF: 0, missionFeeUSD: 0, missionFeeCDF: 0, leaveFeeUSD: 0, trainingFeeUSD: 0, workFeeCDF: 0, operatingFeeUSD: 0, totalCDF: 1200000, totalUSD: 150, status: 'En attente' }
];

export const MOCK_DEPARTMENTS: ServiceDepartment[] = [
  { id: 'DIR', title: 'Direction Générale', roles: ['DG', 'Secrétaire'], region: 'Gombe', icon: Landmark },
  { id: 'RH', title: 'Ressources Humaines', roles: ['DRH', 'Responsable Paie'], region: 'Gombe', icon: UserCog },
  { id: 'FIN', title: 'Finance', roles: ['Directeur Financier', 'Comptable'], region: 'Gombe', icon: Wallet },
  { id: 'MED', title: 'Médical', roles: ['Médecin Chef', 'Conseiller'], region: 'Limete', icon: Stethoscope }
];

export const MOCK_TRAININGS: TrainingSession[] = [
  { id: 'TR1', title: 'Gestion de projet Agile', type: 'Management', provider: 'MESP Academy', startDate: '2024-05-10', endDate: '2024-05-12', location: 'Salle Gombe', status: 'Planifié', attendees: [], capacity: 15, cost: 500 }
];

export const MOCK_SURVEYS: Survey[] = [
  { id: 'S1', title: 'Satisfaction Cantine Q1', deadline: '2024-03-31', status: 'Actif', participants: 45 }
];

export const MOCK_DOCUMENTS: DocumentFile[] = [
  {
    id: 'D1',
    name: 'Règlement Intérieur MESP.pdf',
    type: 'PDF',
    size: '2.4 MB',
    updatedAt: '2023-01-10',
    owner: 'RH',
    category: 'Politiques',
    employeeId: 'E001',
    status: 'Vérifié',
    currentVersion: '2.1',
    versions: []
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    authorId: 'E001',
    content: 'Félicitations à toute l\'équipe pour le succès de la campagne de santé à Kinshasa ! 🎉',
    likes: 45,
    comments: 12,
    shares: 5,
    timestamp: '2h',
    isLiked: true
  }
];

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

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'E002',
    receiverId: 'me',
    content: 'Bonjour, voici les prévisions budgétaires.',
    type: 'text',
    timestamp: new Date(),
    status: 'read'
  }
];

export const MOCK_EMAILS: InternalEmail[] = [
  {
    id: 'em1',
    senderId: 'E001',
    subject: 'Note de Service: Congés',
    preview: 'Chers collègues...',
    body: 'Bonjour à tous...',
    date: '10:30',
    isRead: false,
    isStarred: true,
    folder: 'inbox'
  }
];

export const MOCK_STORIES: SocialStory[] = [];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: 'E001',
    type: 'Congé Annuel',
    startDate: '2023-11-15',
    endDate: '2023-11-30',
    duration: 15,
    status: 'En attente',
    reason: 'Vacances'
  }
];

export const MOCK_JOBS: JobPost[] = [
  {
    id: 'J001',
    title: 'Assistant Comptable',
    department: 'Finance',
    location: 'Kinshasa',
    type: 'Temps Plein',
    postedAt: '2023-10-01',
    status: 'Ouvert',
    applicantsCount: 12
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'C001',
    jobId: 'J001',
    firstName: 'Paul',
    lastName: 'Mukendi',
    email: 'paul@email.com',
    stage: 'Nouveau',
    appliedAt: '2023-10-10',
    rating: 4
  }
];

export const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 'PR001',
    employeeId: 'E001',
    period: 'Q3 2023',
    reviewer: 'Directeur RH',
    score: 85,
    status: 'Finalisé',
    goals: []
  }
];

export const MOCK_ACCESS_DEVICES: AccessDevice[] = [
  {
    id: 'DEV01',
    name: 'Entrée Principale',
    ipAddress: '192.168.1.101',
    port: 4370,
    location: 'Gombe',
    status: 'Online',
    lastSync: 'Il y a 2 min',
    type: 'Biometric'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EX1',
    description: 'Déjeuner client',
    amount: 120,
    currency: 'USD',
    category: 'Repas',
    date: '2023-10-15',
    status: 'En attente'
  }
];

export const MOCK_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet',
    isSystem: true,
    usersCount: 2,
    permissions: [
      { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Settings', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Analytics', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Communication', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }
    ]
  },
  {
    id: 'hr_manager',
    name: 'Responsable RH',
    description: 'Gestion complète du personnel et recrutement',
    isSystem: false,
    usersCount: 1,
    permissions: [
      { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
      { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
      { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: false },
      { module: 'Settings', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { module: 'Analytics', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { module: 'Communication', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: false }
    ]
  },
  {
    id: 'employee',
    name: 'Employé',
    description: 'Accès restreint',
    isSystem: true,
    usersCount: 150,
    permissions: [
        { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        { module: 'Payroll', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        { module: 'Recruitment', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        { module: 'Settings', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        { module: 'Analytics', canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        { module: 'Communication', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false }
    ]
  }
];
