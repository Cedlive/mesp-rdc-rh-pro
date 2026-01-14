import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Fixed: Used ErrorRequestHandler type for proper Express error handling middleware signature (4 arguments)
export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Fix: cast res to any to access statusCode which may not be recognized by the current Response type definition
  const statusCode = (res as any).statusCode === 200 ? 500 : (res as any).statusCode;
  
  console.error('ERREUR BACKEND:', err.message);

  // Fix: cast res to any to access the status method
  (res as any).status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};