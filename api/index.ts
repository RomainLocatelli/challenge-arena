import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { logger } from './src/middlewares/logger.js'
import { errorHandler } from './src/middlewares/errorHandler.js'
import gamesRoutes from './src/routes/games.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares globaux
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(logger)

// Route
app.use('/games', gamesRoutes)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// Error handler (toujours en dernier)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`)
})