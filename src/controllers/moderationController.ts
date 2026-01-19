// Gestion de la modération
// getReportedChallenges : récupére tous les challenges qui ont au moins 1 signalement, avec les détails de chaque signalement
// getReportedParticipations : récupére toutes les participations qui ont au moins 1 signalement, avec les détails de chaque signalement
// approveContent : approuver un contenu = suppression de tous ses signalements
// deleteReportedChallenge : supprime définitivement un challenge signalé /!\ onDelete: Cascade => participations, votes, reports /!\
// deleteReportedParticipation : supprime définitivement une participation signalée /!\ onDelete: Cascade => votes, reports /!\

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';

// Liste tous les challenges signalés avec leurs signalements
export const getReportedChallenges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupère directement tous les challenges qui ont au moins 1 report
    // en incluant les reports dans la même requête
    const challenges = await prisma.challenge.findMany({
      where: {
        // Filtre : seulement les challenges qui ont au moins 1 report de type CHALLENGE
        // On utilise une sous-requête pour vérifier l'existence de reports
        id: {
          in: (
            await prisma.report.findMany({
              where: { targetType: 'CHALLENGE' },
              select: { targetId: true },
              distinct: ['targetId']
            })
          ).map(r => r.targetId)
        }
      },
      include: {
        game: true,
        creator: {
          select: { id: true, username: true, email: true }
        },
        _count: {
          select: { participations: true, votes: true }
        }
      }
    });

    // Pour chaque challenge, récupère ses reports
    // (On ne peut pas faire autrement car Report n'a pas de relation directe avec Challenge)
    const challengesWithReports = await Promise.all(
      challenges.map(async (challenge) => {
        const reports = await prisma.report.findMany({
          where: {
            targetType: 'CHALLENGE',
            targetId: challenge.id
          },
          include: {
            user: {
              select: { id: true, username: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        return {
          ...challenge,
          reports,
          reportCount: reports.length
        };
      })
    );

    res.json({ challenges: challengesWithReports });
  } catch (error) {
    next(error);
  }
};

// Liste toutes les participations signalées avec leurs signalements
export const getReportedParticipations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Même logique que getReportedChallenges, mais pour les participations
    const participations = await prisma.participation.findMany({
      where: {
        id: {
          in: (
            await prisma.report.findMany({
              where: { targetType: 'PARTICIPATION' },
              select: { targetId: true },
              distinct: ['targetId']
            })
          ).map(r => r.targetId)
        }
      },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        challenge: {
          select: { id: true, title: true, slug: true }
        },
        _count: {
          select: { votes: true }
        }
      }
    });

    const participationsWithReports = await Promise.all(
      participations.map(async (participation) => {
        const reports = await prisma.report.findMany({
          where: {
            targetType: 'PARTICIPATION',
            targetId: participation.id
          },
          include: {
            user: {
              select: { id: true, username: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        return {
          ...participation,
          reports,
          reportCount: reports.length
        };
      })
    );

    res.json({ participations: participationsWithReports });
  } catch (error) {
    next(error);
  }
};

// Approuver un contenu (supprime tous ses signalements, garde le contenu)
export const approveContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { targetType, targetId } = req.body;

    // Validation des paramètres
    if (!targetType || !targetId) {
      throw new AppError('Target type and target ID are required', 400);
    }

    if (targetType !== 'CHALLENGE' && targetType !== 'PARTICIPATION') {
      throw new AppError('Invalid target type. Must be CHALLENGE or PARTICIPATION', 400);
    }

    // Vérifier que le contenu existe
    if (targetType === 'CHALLENGE') {
      const challenge = await prisma.challenge.findUnique({ where: { id: targetId } });
      if (!challenge) {
        throw new AppError('Challenge not found', 404);
      }
    } else {
      const participation = await prisma.participation.findUnique({ where: { id: targetId } });
      if (!participation) {
        throw new AppError('Participation not found', 404);
      }
    }

    // Supprimer tous les signalements de ce contenu
    const result = await prisma.report.deleteMany({
      where: {
        targetType,
        targetId
      }
    });

    res.json({ 
      message: 'Content approved successfully. All reports have been removed.',
      deletedReports: result.count
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un challenge signalé (+ cascade : participations, votes, reports)
export const deleteReportedChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Vérifier que le challenge existe et récupérer les compteurs pour info
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            participations: true, 
            votes: true 
          }
        }
      }
    });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    // Supprimer le challenge
    // Grâce à onDelete: Cascade, Prisma supprime automatiquement :
    // - Toutes les participations liées
    // - Tous les votes sur le challenge
    // - Tous les votes sur les participations liées
    // - Tous les reports sur le challenge et ses participations
    await prisma.challenge.delete({
      where: { id }
    });

    res.json({ 
      message: 'Challenge deleted successfully',
      details: {
        deletedParticipations: challenge._count.participations,
        deletedChallengeVotes: challenge._count.votes
      }
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer une participation signalée (+ cascade : votes, reports)
export const deleteReportedParticipation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Vérifier que la participation existe et récupérer les compteurs
    const participation = await prisma.participation.findUnique({
      where: { id },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    if (!participation) {
      throw new AppError('Participation not found', 404);
    }

    // Supprimer la participation
    // Grâce à onDelete: Cascade, Prisma supprime automatiquement :
    // - Tous les votes sur cette participation
    // - Tous les reports sur cette participation
    await prisma.participation.delete({
      where: { id }
    });

    res.json({ 
      message: 'Participation deleted successfully',
      details: {
        deletedVotes: participation._count.votes
      }
    });
  } catch (error) {
    next(error);
  }
};