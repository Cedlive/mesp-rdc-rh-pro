
export interface PayrollEntry {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalaryCDF: number;
  totalUSD: number;
  status: 'Payé' | 'En attente' | 'Brouillon';
}

let PAYROLL_DB: PayrollEntry[] = [
  { id: 'P1', employeeId: 'E001', month: 'Octobre', year: 2023, baseSalaryCDF: 1500000, totalUSD: 500, status: 'Payé' }
];

export class PayrollService {
  async getAll() { return PAYROLL_DB; }

  async generatePayroll(month: string, year: number, employees: any[]) {
    // Logique complexe de calcul de paie simulée ici
    const newEntries: PayrollEntry[] = employees.map((emp: any) => ({
      id: `P${Date.now()}_${emp.id}`,
      employeeId: emp.id,
      month,
      year,
      baseSalaryCDF: emp.baseSalary || 1000000,
      totalUSD: 250, // Prime standard simulée
      status: 'Brouillon'
    }));
    
    PAYROLL_DB = [...newEntries, ...PAYROLL_DB];
    return newEntries;
  }
}
