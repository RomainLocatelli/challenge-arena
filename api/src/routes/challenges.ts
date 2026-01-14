import { Router } from 'express'
import { getAllChallenges } from '../controllers/challengesController.js'

const router = Router()

router.get('/', getAllChallenges)

export default router