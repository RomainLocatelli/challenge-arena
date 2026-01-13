import { Router } from 'express'
import { searchGames, getAllGames } from '../controllers/gamesController.js'

const router = Router()

router.get('/search', searchGames)
router.get('/', getAllGames)

export default router