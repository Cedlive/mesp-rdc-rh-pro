import { NextFunction } from 'express';
import { AnnouncementService } from '../services/AnnouncementService';

export class AnnouncementController {
  private service = new AnnouncementService();

  getAll = async (req: any, res: any, next: any) => {
    try {
      const data = await this.service.getAll();
      res.status(200).json(data);
    } catch (e) { next(e); }
  };

  create = async (req: any, res: any, next: any) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  };

  delete = async (req: any, res: any, next: any) => {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({ message: 'Annonce supprimée' });
    } catch (e) { next(e); }
  };
}