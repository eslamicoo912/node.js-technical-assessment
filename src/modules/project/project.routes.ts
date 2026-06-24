import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authenticate } from '../../shared/middlewares/authenticate';
import { validate } from '../../shared/middlewares/validateRequest';
import { createProjectSchema, updateProjectSchema } from './project.validation';
import { AnyZodObject } from 'zod/v3';
import { accessControl } from '../../shared/middlewares/authorize';
import { USER_ROLES } from '../../shared/constants/user-roles';

const router = Router();
const projectController = new ProjectController();

router.use(authenticate);

router.post("/", validate(createProjectSchema as unknown as AnyZodObject), projectController.create)
router.get("/", projectController.getAll)
router.get("/:id", projectController.getOne)
router.patch("/:id", validate(updateProjectSchema as unknown as AnyZodObject), projectController.update)
router.delete("/:id", accessControl([USER_ROLES.ADMIN]), projectController.delete);

export default router;