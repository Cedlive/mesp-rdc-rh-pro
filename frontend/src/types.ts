
import { LucideIcon } from 'lucide-react';

export interface ModulePermission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  usersCount: number;
  permissions: ModulePermission[];
}

// Added PipelineStage type for Recruitment workflow
export type PipelineStage = 'Nouveau' | 'Entretien RH' | 'Test Technique' | 'Entretien Manager' | 'Offre';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Actif' | 'En Congé' | 'Mission' | 'Inactif';
  joinDate: string;
  insuranceNumber: string;
  affiliation?: string;
  password?: string;
  contractType?: 'CDI' | 'CDD' | 'Stage' | 'Prestataire' | 'Détaché';
  sex?: 'Masculin' | 'Féminin';
  bloodGroup?: string;
  cnssNumber?: string;
  birthDate?: string;
  bankName?: string;
  bankAccount?: string;
  vehicleId?: string;
  lastLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
    address: string;
    signalStrength: 'strong' | 'medium' | 'weak';
  };
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: 'En mouvement' | 'Stationné' | 'Maintenance' | 'Alerte';
  fuelLevel: number;
  lastLat: number;
  lastLng: number;
  assignedTo?: string;
  speed: number;
}

// Fix: Added missing fee properties to match MOCK_PAYROLL literal in constants.ts
export interface PayrollEntry {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalaryCDF: number;
  primeUSD: number;
  primeCDF: number;
  missionFeeUSD: number;
  missionFeeCDF?: number;
  officeSuppliesFeeCDF?: number;
  medicinePurchaseFeeUSD?: number;
  fuelFeeCDF?: number;
  maintenanceFeeCDF?: number;
  operatingFeeUSD?: number;
  totalCDF: number;
  totalUSD: number;
  status: 'Payé' | 'En attente' | 'Brouillon';
}

export interface ServiceDepartment {
  id: string;
  title: string;
  icon: LucideIcon;
  roles: string[];
  region: string;
  managerId?: string;
  headRole?: string;
  tasks?: any[];
  archives?: string[];
}

// Added MedicalVoucher interface required by constants.ts
export interface MedicalVoucher {
  id: string;
  teacherId?: string;
  teacherName: string;
  facilityName: string;
  type: string;
  amount: number;
  currency?: string;
  status: string;
  date: string;
}

// Added DashboardTask interface required by constants.ts
export interface DashboardTask {
  id: string;
  title: string;
  status: 'Pending' | 'Completed';
  type: 'Action' | 'Request';
  assignedTo?: string;
}

// Added ChatContact interface required by constants.ts
export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  onlineStatus: 'online' | 'offline' | 'busy';
  type?: 'private' | 'group';
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: string;
  reason: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'General' | 'Urgent' | 'Event';
  isPinned?: boolean;
}

export interface TrainingSession {
  id: string;
  title: string;
  type: string;
  provider: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'Planifié' | 'En cours' | 'Terminé';
  attendees: string[];
  capacity: number;
  cost: number;
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;
  updatedAt: string;
  updatedBy: string;
  size: string;
  comment: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'IMG';
  size: string;
  updatedAt: string;
  owner: string;
  category: string;
  status: string;
  currentVersion: string;
  versions: DocumentVersion[];
}

export interface Candidate {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  stage: string;
  appliedAt: string;
  rating: number;
}

export interface JobPost {
  id: string;
  title: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  reviewer: string;
  score: number;
  status: string;
  goals: any[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: 'USD' | 'CDF';
  category: string;
  date: string;
  status: string;
}

export interface Survey {
  id: string;
  title: string;
  deadline: string;
  status: string;
  participants: number;
}

export interface CompanySettings {
  companyName: string;
  splashLogoUrl: string | null;
  menuLogoUrl: string | null;
  loginLeftTitle: string;
  loginLeftDescription: string;
  loginLeftBgUrl: string;
  themeColor: string;
}

export interface LoginAttempt {
  id: string;
  date: string;
  time: string;
  device: string;
  ip: string;
  location: string;
  status: 'success' | 'failed';
}
