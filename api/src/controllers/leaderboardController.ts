// controlleur du leaderboard
// topByParticipations : par nombre de participations
// topByLikes : par somme des likes de l'ensemble de leurs participations

import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma.js'

const LEADERBOARD_TOP_PARTICIPANTS = 10
const LEADERBOARD_TOP_LIKED = 10

export const getLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Top users par nombre de participations
    const topByParticipations = await prisma.user.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { participations: true },
        },
      },
      orderBy: {
        participations: { _count: 'desc' },
      },
      take: LEADERBOARD_TOP_PARTICIPANTS,
    })

    // On récupère : users + participations + votes
    const usersWithLikes = await prisma.user.findMany({
      where: { isDeleted: false },
      include: {
        participations: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
      },
    })

    // Top users par somme des likes de l'ensemble de leurs participations
    const topByLikes = usersWithLikes
      .map(user => {
        const totalLikes = user.participations.reduce((sum, participation) => {
          return sum + participation._count.votes
        }, 0)

        return {
          username: user.username,
          totalLikes,
        }
      })
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, LEADERBOARD_TOP_LIKED)

    res.json({
      topByParticipations: topByParticipations.map(u => ({
        username: u.username,
        participationCount: u._count.participations,
      })),
      topByLikes,
    })
  } catch (error) {
    next(error)
  }
}