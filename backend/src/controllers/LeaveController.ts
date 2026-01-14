import { Request, Response, NextFunction } from 'express';
import { LeaveService } from '../services/LeaveService';

export class LeaveController {
  private leaveService = new LeaveService();

  getAll = async (req: any, res: any, next: any) => {
    try {
      // Si admin, tout voir, sinon filtrer (logique simplifiée ici)
      const leaves = await this.leaveService.getAllLeaves();
      res.status(200).json(leaves);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: any, res: any, next: any) => {
    try {
      // req.user est injecté par le middleware protect
      const employeeId = req.user.id; 
      const leave = await this.leaveService.createLeaveRequest({
        ...req.body,
        employeeId // Force l'ID de l'utilisateur connecté
      });
      res.status(201).json(leave);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Ici on pourrait vérifier si l'utilisateur est Manager/RH
      
      const updatedLeave = await this.leaveService.updateStatus(id, status);
      res.status(200).json(updatedLeave);
    } catch (error) {
      next(error);
    }
  };
}