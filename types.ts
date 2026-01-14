
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

// Fix: Add optional properties to Employee to match usage in Settings and other pages
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
  contractType?: 'CDI' | 'CDD' | 'Prestataire' | 'Détaché';
  sex?: 'M' | 'F';
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
    altitude?: number;
    speed?: number;
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

// Fix: Add missing fee properties to PayrollEntry
export interface PayrollEntry {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalaryCDF: number;
  primeUSD: number;
  primeCDF: number;
  missionFeeUSD: number;
  fuelFeeCDF?: number;
  maintenanceFeeCDF?: number;
  operatingFeeUSD?: number;
  totalCDF: number;
  totalUSD: number;
  status: 'Payé' | 'En attente' | 'Brouillon';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Congé Annuel' | 'Maladie' | 'Mission' | 'Circonstance' | 'Récupération';
  startDate: string;
  endDate: string;
  duration: number;
  status: 'En attente' | 'Approuvé' | 'Rejeté';
  reason: string;
  approverId?: string;
}

// Fix: Add headRole, tasks, and archives to ServiceDepartment
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

export interface DashboardTask {
  id: string;
  title: string;
  status: 'Pending' | 'Completed';
  type: 'Action' | 'Request';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
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

// Fix: Add missing exported members required by constants.ts and pages
export interface Mission {
  id: string;
  agentName: string;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'En cours' | 'Terminée' | 'Planifiée';
}

export interface MedicalVoucher {
  id: string;
  teacherName: string;
  teacherId?: string;
  facilityName: string;
  type: string;
  amount: number;
  currency?: string;
  status: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'Urgent' | 'General' | 'Event';
  author?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  color: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  onlineStatus: 'online' | 'offline' | 'busy';
  type?: string;
}

export interface InternalEmail {
  id: string;
  senderId: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
}

export interface JobPost {
  id: string;
  title: string;
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

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  reviewer: string;
  score: number;
  status: string;
  goals: any[];
}

export interface TrainingSession {
  id: string;
  title: string;
  type: 'Technique' | 'Management' | 'Soft Skills' | 'Santé' | 'Sécurité';
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
  category: 'Politiques' | 'Contrats' | 'Finance' | 'Personnel';
  status: string;
  currentVersion: string;
  versions: DocumentVersion[];
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
