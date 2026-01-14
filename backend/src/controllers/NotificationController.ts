import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  private service = new NotificationService();

  getAll = async (req: any, res: any, next: any) => {
    try {
      const notifs = await this.service.getForUser(req.user.id);
      res.json(notifs);
    } catch (e) { next(e); }
  };

  markRead = async (req: any, res: any, next: any) => {
    try {
      await this.service.markAsRead(req.params.id);
      res.json({ success: true });
    } catch (e) { next(e); }
  };
}