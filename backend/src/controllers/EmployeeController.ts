import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/EmployeeService';

export class EmployeeController {
  private employeeService = new EmployeeService();

  getAll = async (req: any, res: any, next: any) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: any, res: any, next: any) => {
    try {
      const employee = await this.employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        res.status(404);
        throw new Error('Employé non trouvé');
      }
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: any, res: any, next: any) => {
    try {
      const newEmployee = await this.employeeService.createEmployee(req.body);
      res.status(201).json(newEmployee);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedEmployee = await this.employeeService.updateStatus(id, status);
      res.status(200).json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  };
}