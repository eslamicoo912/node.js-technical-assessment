import { Router } from 'express';
import { TaskController } from './task.controller';
import { authenticate } from '../../shared/middlewares/authenticate';
import { validate } from '../../shared/middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema } from './task.validation';
import { AnyZodObject } from 'zod/v3';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.post('/projects/:projectId/tasks', validate(createTaskSchema as unknown as AnyZodObject), taskController.create);
router.get('/projects/:projectId/tasks', taskController.getAll);
router.get('/tasks/:id', taskController.getOne);
router.patch('/tasks/:id', validate(updateTaskSchema as unknown as AnyZodObject), taskController.update);
router.delete('/tasks/:id', taskController.delete);

export default router;