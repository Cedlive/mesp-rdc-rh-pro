
export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: 'USD' | 'CDF';
  category: string;
  date: string;
  status: 'En attente' | 'Approuvé' | 'Rejeté';
}

let EXPENSES: Expense[] = [
  { id: 'EX1', description: 'Transport Mission', amount: 50, currency: 'USD', category: 'Transport', date: '2023-11-01', status: 'En attente' }
];

export class ExpenseService {
  async getAll() { return EXPENSES; }
  
  async create(data: any) {
    const newEx = { id: `EX${Date.now()}`, ...data, status: 'En attente' };
    EXPENSES.unshift(newEx);
    return newEx;
  }
}
