
import { logger } from '../utils/logger';

// Interface locale pour le backend (similaire au frontend mais pour la BDD)
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Congé Annuel' | 'Maladie' | 'Mission' | 'Circonstance';
  startDate: string;
  endDate: string;
  duration: number;
  status: 'En attente' | 'Approuvé' | 'Rejeté';
  reason?: string;
  createdAt: string;
}

// Données Mock en mémoire
let MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: 'E001',
    type: 'Congé Annuel',
    startDate: '2023-11-15',
    endDate: '2023-11-30',
    duration: 15,
    status: 'En attente',
    reason: 'Vacances familiales',
    createdAt: new Date().toISOString()
  }
];

export class LeaveService {
  
  async getAllLeaves() {
    return MOCK_LEAVES;
  }

  async getLeavesByEmployee(employeeId: string) {
    return MOCK_LEAVES.filter(l => l.employeeId === employeeId);
  }

  async createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) {
    // Validation basique
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      throw new Error("La date de fin ne peut pas être antérieure à la date de début");
    }

    const newRequest: LeaveRequest = {
      id: `LR${Date.now()}`,
      ...data,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    MOCK_LEAVES.unshift(newRequest);
    logger.info(`Nouvelle demande de congé créée: ${newRequest.id} pour l'employé ${data.employeeId}`);
    return newRequest;
  }

  async updateStatus(id: string, status: 'Approuvé' | 'Rejeté') {
    const leaveIndex = MOCK_LEAVES.findIndex(l => l.id === id);
    if (leaveIndex === -1) {
      throw new Error("Demande non trouvée");
    }

    MOCK_LEAVES[leaveIndex].status = status;
    logger.info(`Statut congé ${id} mis à jour: ${status}`);
    return MOCK_LEAVES[leaveIndex];
  }
}
