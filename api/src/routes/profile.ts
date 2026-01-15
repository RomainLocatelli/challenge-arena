import { Router } from 'express'
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.get('/', authMiddleware, getProfile)
router.patch('/', authMiddleware, updateProfile)
router.delete('/', authMiddleware, deleteProfile)

export default router