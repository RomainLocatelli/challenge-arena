import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authServices.js';
import jwt from 'jsonwebtoken';

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

// Appelle le service login(), génère un JWT, retourne le token + user
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = req.body;

    // Appeler le service login (retourne user sans password)
    const user = await authService.login(loginData);

    // Générer le JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    // Retourner la réponse HTTP 200 OK avec token + user
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};
