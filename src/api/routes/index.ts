import { Router } from 'express';

const router = Router();

// Comprueba que la API está viva.
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default router;