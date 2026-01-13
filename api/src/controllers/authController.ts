import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authServices.js';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   Récupérer les données du body (déjà validées par le middleware)
    const userData = req.body;

    //   Appeler le service register
    const user = await authService.register(userData);

    //   Retourner la réponse HTTP 201 Created
    res.status(201).json({
      message: 'User successfully created',
      user
    });
  } catch (error) {
    //   Passer l'erreur au middleware d'erreur
    next(error);
  }
};
