import { Response, NextFunction } from 'express';
import { PayrollService } from '../services/PayrollService';
import { EmployeeService } from '../services/EmployeeService';

export class PayrollController {
  private payrollService = new PayrollService();
  private employeeService = new EmployeeService();

  getAll = async (req: any, res: any, next: any) => {
    try { res.json(await this.payrollService.getAll()); } catch (e) { next(e); }
  };

  generate = async (req: any, res: any, next: any) => {
    try {
      const { month, year } = req.body;
      // Récupérer les employés actifs pour générer la paie
      const employees = await this.employeeService.getAllEmployees();
      const activeEmployees = employees.filter(e => e.status === 'Actif');
      
      const result = await this.payrollService.generatePayroll(month, year, activeEmployees);
      res.status(201).json(result);
    } catch (e) { next(e); }
  };
}