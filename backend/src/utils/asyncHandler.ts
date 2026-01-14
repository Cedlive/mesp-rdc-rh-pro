import { Request, Response, NextFunction } from 'express';

// Wrapper pour éviter les try-catch répétitifs dans les contrôleurs
export const asyncHandler = (fn: (req: Request, res: Response, next: any) => Promise<any>) => {
  return (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};