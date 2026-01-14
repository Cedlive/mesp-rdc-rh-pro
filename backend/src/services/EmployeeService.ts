
import { Employee } from '../types';

// --- DONNÉES EN MÉMOIRE POUR QUE LE BACKEND FONCTIONNE IMMÉDIATEMENT ---
// NOTE: En production, remplacez ceci par des appels Prisma/TypeORM vers PostgreSQL.
let MOCK_DB_EMPLOYEES: Employee[] = [
  {
    id: 'ADMIN_001',
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@mesp.cd',
    role: 'Directeur RH',
    department: 'Direction Générale',
    status: 'Actif',
    password: 'admin', // En clair pour la démo, à hacher en prod
    avatar: 'https://ui-avatars.com/api/?name=Admin+MESP&background=0f172a&color=fff'
  },
  {
    id: 'E001',
    firstName: 'Jean',
    lastName: 'Ilunga',
    role: 'Responsable RH',
    department: 'Service de Ressources humaines',
    email: 'jean.ilunga@mesp-rdc.cd',
    status: 'Actif',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'E002',
    firstName: 'Marie',
    lastName: 'Kapinga',
    role: 'Comptable',
    department: 'Finance et Comptabilité',
    email: 'marie.kapinga@mesp-rdc.cd',
    status: 'Actif',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  // Simulation d'un employé en attente
  {
    id: 'E_NEW_01',
    firstName: 'Patrick',
    lastName: 'Mbuyi',
    role: 'Stagiaire IT',
    department: 'Service Informatique',
    email: 'patrick.m@mesp-rdc.cd',
    status: 'Inactif', // En attente d'activation
    password: 'password123',
    joinDate: '2023-11-01'
  }
];

export class EmployeeService {
  
  // Récupérer tous les employés
  async getAllEmployees() {
    return MOCK_DB_EMPLOYEES;
  }

  // Récupérer par ID
  async getEmployeeById(id: string) {
    return MOCK_DB_EMPLOYEES.find(e => e.id === id);
  }

  // Créer un employé
  async createEmployee(data: any) {
    const newEmployee: Employee = {
      id: `E${Date.now()}`, // Génération ID simple
      ...data,
      status: 'Inactif', // Par défaut inactif lors de l'inscription autonome
      joinDate: new Date().toISOString().split('T')[0]
    };

    MOCK_DB_EMPLOYEES.unshift(newEmployee); // Ajout au début de la liste
    return newEmployee;
  }

  // Mettre à jour le statut (Activation)
  async updateStatus(id: string, status: 'Actif' | 'Inactif' | 'Mission') {
    const index = MOCK_DB_EMPLOYEES.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Employé non trouvé");
    
    MOCK_DB_EMPLOYEES[index].status = status;
    return MOCK_DB_EMPLOYEES[index];
  }
}
