import { Router } from 'express';
import * as taskController from '../../controllers/task.controller';
import { authenticate } from '../middlewares/authenticate';
import { validateBody, validateParams } from '../middlewares/validate';
import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../schemas/task.schema';

const router = Router();

// Todas las rutas de tareas exigen un JWT válido.
router.use(authenticate);

router.post('/', validateBody(createTaskSchema), taskController.create);
router.get('/', taskController.list);
router.get('/:id', validateParams(taskIdParamSchema), taskController.getOne);
router.put(
  '/:id',
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  taskController.update,
);
router.delete('/:id', validateParams(taskIdParamSchema), taskController.remove);

export default router;