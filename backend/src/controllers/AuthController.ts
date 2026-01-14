import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  login = async (req: any, res: any, next: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('Email et mot de passe requis');
      }

      const result = await this.authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: any, res: any, next: any) => {
    try {
      // Pour l'instant, on simule juste
      res.status(201).json({ message: "Inscription non activée publiquement." });
    } catch (error) {
      next(error);
    }
  };
}