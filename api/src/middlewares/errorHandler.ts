// error handler gobal : intercepte toutes les erreurs et retourne la bonne réponse HTTP

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ZodError } from 'zod';

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

  // Erreur de validation Zod non catchée par le middleware validate()
  // (cas des .parse() appelés directement dans certains contrôleurs)
  if (err instanceof ZodError) {
    const message = err.issues.map((e) => e.message).join(', ');
    return res.status(400).json({
      status: 'error',
      message: message || 'Validation failed'
    });
  }

  // Sinon, c'est un bug serveur (erreur inconnue)
  console.error('💥 Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};