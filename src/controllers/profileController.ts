// Ici on gère le profil utilisateur
// getProfile : renvoie les infos utilisateur + ses challenges + ses participations
// updateProfile : on met à jour les champs modifiés
// deleteProfile : soft delete => isDeleted: true

import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../utils/AppError.js'
import argon2 from 'argon2'

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        createdChallenges: {
          include: { game: true },
          orderBy: { createdAt: 'desc' },
        },
        participations: {
          include: { challenge: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const { username, email, password } = req.body

    if (!userId) {
      throw new AppError('User not authenticated', 401)
    }

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {}

    if (username) {dataToUpdate.username = username}
    if (email) {dataToUpdate.email = email}
    if (password) {dataToUpdate.password = await argon2.hash(password)}

    // Mettre à jour
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    res.json({ user: updatedUser })
  } catch (error) {
    next(error)
  }
}

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401)
    }

    // Soft delete
    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}