import { Router } from 'express';
import { registerController } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema } from '../schemas/authSchemas.js';

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validate(registerSchema), // Valide les données avec Zod
  registerController // Exécute le controller
);

export default router;
