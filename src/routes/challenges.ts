import { Router } from 'express'
import { getAllChallenges, getChallengeById } from '../controllers/challengesController.js'

const router = Router();

router.get('/:id', getChallengeById)
router.get('/', getAllChallenges)

export default router