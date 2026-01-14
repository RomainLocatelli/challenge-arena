// getAllChallenges : liste tous les challenges avec leurs jeux associés, triés par date de création (plus récent en premier).
// getChallengeById : récupère un challenge avec son jeu et ses participations

import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../utils/AppError.js'

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

export const getChallengeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        game: true,
        participations: true,
      },
    })

    if (!challenge) {
      throw new AppError('Challenge not found', 404)
    }

    res.json({ challenge })
  } catch (error) {
    next(error)
  }
}