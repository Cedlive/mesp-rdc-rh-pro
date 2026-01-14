import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/SettingsService';

export class SettingsController {
  private settingsService = new SettingsService();

  getSettings = async (req: Request, res: any, next: any) => {
    try {
      const settings = await this.settingsService.getSettings();
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: any, res: any, next: any) => {
    try {
      // Vérification Rôle Admin (simulée ici, devrait être dans un middleware 'restrictTo')
      if (req.user.role !== 'Directeur RH' && req.user.role !== 'Administrateur') {
         return res.status(403).json({ message: 'Accès refusé. Réservé aux administrateurs.' });
      }

      const updated = await this.settingsService.updateSettings(req.body);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };
}