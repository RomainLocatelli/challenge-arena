import { Router } from 'express';
import {
  getReportedChallenges,
  getReportedParticipations,
  approveContent,
  deleteReportedChallenge,
  deleteReportedParticipation
} from '../controllers/moderationController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = Router();

// Toutes les routes nécessitent auth + admin
router.use(authMiddleware, requireAdmin);

// Récupérer les contenus signalés
router.get('/challenges', getReportedChallenges);
router.get('/participations', getReportedParticipations);

// Approuver un contenu (retire les signalements)
router.post('/approve', approveContent);

// Supprimer un contenu signalé
router.delete('/challenge/:id', deleteReportedChallenge);
router.delete('/participation/:id', deleteReportedParticipation);

export default router;