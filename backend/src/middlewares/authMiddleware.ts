
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const protect = (req: AuthRequest, res: any, next: NextFunction) => {
  let token;
  
  // 1. Détection standard (Headers Bearer)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Détection par URL (Pour Power BI Desktop / Excel)
  else if (req.query && req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Jeton manquant.' });
  }

  try {
    // Mode Démo / Prototype
    if (token.startsWith('JWT_MOCK')) {
      req.user = { id: 'ADMIN_001', role: 'Administrateur' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mesp_secure_secret_2024');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expirée ou invalide.' });
  }
};
