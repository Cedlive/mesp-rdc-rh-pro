
import { Request } from 'express';

// Extension de l'interface Request pour inclure l'utilisateur connecté
export interface AuthRequest extends Request {
  user?: any;
  headers: any;
  // Fix: Explicitly add query property to resolve Property 'query' does not exist on type 'AuthRequest' errors in middlewares
  query: any;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'Actif' | 'Inactif' | 'Mission' | 'En Congé';
  password?: string; // Haché en BDD
  avatar?: string;
  joinDate?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
  metadata?: any;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  type: 'private' | 'group';
  lastMessageTime: string;
  unreadCount: number;
  onlineStatus: 'online' | 'offline' | 'busy';
  isVerified?: boolean;
}
