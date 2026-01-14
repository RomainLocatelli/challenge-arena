import { Router } from 'express';
import { registerController, loginController } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validate(registerSchema), // Valide les données avec Zod
  registerController // Exécute le controller
);

// POST /auth/login
router.post(
  '/login',
  validate(loginSchema), // Valide les données avec Zod
  loginController // Exécute le controller
);

export default router;
