import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './src/middlewares/logger.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import gamesRoutes from './src/routes/games.js';
import challengesRoutes from './src/routes/challenges.js';
import participationsRoutes from './src/routes/participations.js';
import homeRoutes from './src/routes/home.js';
import leaderboardRoutes from './src/routes/leaderboard.js';
import challengeVoteRoutes from './src/routes/challengeVote.js';
import profileRoutes from './src/routes/profile.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes API
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/games', gamesRoutes);
app.use('/challenges', challengesRoutes);
app.use('/challengeVote', challengeVoteRoutes);
app.use('/participation', participationsRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Route Accueil
app.use('/', homeRoutes);

// Error handler (toujours en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`);
});
