// Contrôleur qui proxy la recherche de jeux vers l'API RAWG et retourne les résultats formatés (id, slug, name, image) pour l'autocompletion

import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError.js'
import { prisma } from '../../lib/prisma'

const RAWG_API_KEY = process.env.RAWG_API_KEY
const RAWG_BASE_URL = 'https://api.rawg.io/api'

export const searchGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query

    if (!q || typeof q !== 'string') {
      throw new AppError('Query parameter "q" is required', 400)
    }

    const response = await fetch(
      `${RAWG_BASE_URL}/games?search=${encodeURIComponent(q)}&key=${RAWG_API_KEY}`
    )

    if (!response.ok) {
      throw new AppError('RAWG API unavailable', 503)
    }

    const data = await response.json()

    res.json({
      results: data.results.map((game: any) => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        background_image: game.background_image,
      })),
    })
  } catch (error) {
    next(error)
  }
}

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { title: 'asc' },
    })

    res.json({ games })
  } catch (error) {
    next(error)
  }
}

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        challenges: true,
      },
    })

    if (!game) {
      throw new AppError('Game not found', 404)
    }

    res.json({ game })
  } catch (error) {
    next(error)
  }
}