import { NextFunction } from 'express';
import { DocumentService } from '../services/DocumentService';

export class DocumentController {
  private service = new DocumentService();

  getAll = async (req: any, res: any, next: any) => {
    try { res.json(await this.service.getAll()); } catch (e) { next(e); }
  };

  create = async (req: any, res: any, next: any) => {
    try { res.status(201).json(await this.service.create(req.body)); } catch (e) { next(e); }
  };
}