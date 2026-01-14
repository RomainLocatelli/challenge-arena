import { Router } from 'express'
import { 
  getAllChallenges, 
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge
} from '../controllers/challengesController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.get('/:id', getChallengeById)
router.get('/', getAllChallenges)
router.post('/', authMiddleware, createChallenge)
router.patch('/:id', authMiddleware, updateChallenge)
router.delete('/:id', authMiddleware, deleteChallenge)

export default router