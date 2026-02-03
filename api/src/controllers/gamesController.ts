// searchGames : qui proxy la recherche de jeux vers l'API RAWG et retourne les résultats formatés (id, slug, name, image) pour l'autocompletion
// getAllGames : récupère tous les jeux de la BDD
// getGameBySlug : récupère un jeu avec tous ses challenges associés

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../../lib/prisma.js';



export const searchGames = async (req: Request, res: Response, next: NextFunction) => {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;
  const RAWG_BASE_URL = process.env.RAWG_BASE_URL;

  type GameRawgSearchResult = {
    id: number;
    slug: string;
    name: string;
    background_image: string;
  };

  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      throw new AppError('Query parameter "q" is required', 400);
    }

    const response = await fetch(
      `${RAWG_BASE_URL}/games?search=${encodeURIComponent(q)}&key=${RAWG_API_KEY}`
    );
    if (!response.ok) {
      throw new AppError('RAWG API unavailable', 503);
    }

    const data = await response.json();

    res.json({
      results: data.results.map((game: GameRawgSearchResult) => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        background_image: game.background_image
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { title: 'asc' }
    });

    res.json({ games });
  } catch (error) {
    next(error);
  }
};

export const getGameBySlug = async (req: Request, res: Response, next: NextFunction) => {

  type PrismaChallengeWithCount = {
    id: string; // ← UUID, donc string
    slug: string;
    title: string;
    scoreFormat: string;
    description: string;
    details: string | null;
    createdBy: string;
    gameId: string; // ← string aussi
    createdAt: Date;
    updatedAt: Date;
    game: {
      id: string;
      slug: string;
      title: string;
      imageUrl: string;
    };
    _count: {
      votes: number;
    };
  };

  type GameWithChallenges = {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    challenges: PrismaChallengeWithCount[];
  };

  try {
    const { slug } = req.params;

    const game: GameWithChallenges | null = await prisma.game.findUnique({
      where: { slug },
      include: {
        challenges: {
          include: {
            game: true, // ← Inclut l'objet game dans chaque challenge
            _count: {
              select: { votes: true } // ← Compte les votes
            }
          }
        }
      }
    });

    if (!game) {
      throw new AppError('Game not found', 404);
    }

    // Formate la réponse pour ajouter voteCount et retirer _count
    res.json({
  game: {
    ...game,
    challenges: game.challenges.map(({ _count, game: _, ...challenge }) => ({
      ...challenge,
      voteCount: _count.votes
    }))
      }
    });
  } catch (error) {
    next(error);
  }
};
