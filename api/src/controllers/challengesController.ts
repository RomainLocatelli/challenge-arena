// Contrôleur pour lister tous les challenges avec leurs jeux associés, triés par date de création (plus récent en premier).

import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma.js'

export const getAllChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const challenges = await prisma.challenge.findMany({
      include: {
        game: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ challenges })
  } catch (error) {
    next(error)
  }
}