import argon2 from 'argon2';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { RegisterInput } from '../schemas/authSchemas.js';

//  Hash du mot de passe
export const register = async (data: RegisterInput) => {
  const hashedPassword = await argon2.hash(data.password);

  //  Créé l'utilisateur dans la BDD
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword
      }
    });
    //  Retire le mdp avant de retourner
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error: any) {
    //  Erreur si le user existe déjà
    if (error.code === 'P2002') {
      throw new AppError('Email or username already in use', 409);
    }

    throw error;
  }
};
