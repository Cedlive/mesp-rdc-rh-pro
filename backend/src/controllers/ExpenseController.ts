import { NextFunction } from 'express';
import { ExpenseService } from '../services/ExpenseService';

export class ExpenseController {
  private service = new ExpenseService();

  getAll = async (req: any, res: any, next: any) => {
    try { res.json(await this.service.getAll()); } catch (e) { next(e); }
  };

  create = async (req: any, res: any, next: any) => {
    try { res.status(201).json(await this.service.create(req.body)); } catch (e) { next(e); }
  };
}