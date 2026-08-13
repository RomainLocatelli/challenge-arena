// error handler gobal : intercepte toutes les erreurs et retourne la bonne réponse HTTP

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Si c'est une erreur custom (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Erreur de parsing JSON (body malformé, envoyé par express.json())
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON body'
    });
  }

  // Sinon, c'est un bug serveur (erreur inconnue)
  console.error('💥 Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};