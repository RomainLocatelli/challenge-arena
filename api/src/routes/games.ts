import { Router } from 'express'
import { searchGames, getAllGames, getGameById } from '../controllers/gamesController.js'

const router = Router()

router.get('/search', searchGames)
router.get('/:id', getGameById)
router.get('/', getAllGames)

export default router