
import { Response, NextFunction } from 'express';

/**
 * Middleware qui vérifie si l'utilisateur a un rôle spécifique
 */
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès interdit: Droits insuffisants pour cette action stratégique.' 
      });
    }
    next();
  };
};

/**
 * Middleware de vérification de permission granulaire
 * Utilisation: router.post('/approve', checkPermission('Payroll', 'canApprove'), ...)
 */
export const checkPermission = (moduleName: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove') => {
  return (req: any, res: any, next: NextFunction) => {
    const user = req.user;
    
    // Admin bypass
    if (user.role === 'Administrateur') return next();

    // Dans une app réelle, les permissions seraient récupérées depuis la BDD ou injectées dans le JWT
    // Ici on simule une structure de permissions attachée à l'utilisateur
    const hasPerm = user.permissions?.some((p: any) => p.module === moduleName && p[action] === true);

    if (!hasPerm && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ 
            message: `Permission manquante: ${moduleName}:${action}` 
        });
    }

    next();
  };
};
