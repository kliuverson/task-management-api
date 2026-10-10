import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Comprueba que la API está viva. 
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
// Monta las rutas de autenticación bajo /auth.
router.use('/auth', authRoutes);

export default router;