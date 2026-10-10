import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { validateBody } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

// Rutas de autenticación: registro y login.
const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

export default router;