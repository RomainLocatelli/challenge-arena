import { Router } from 'express'
import { searchGames } from '../controllers/gamesController.js'

const router = Router()

router.get('/search', searchGames)

export default router