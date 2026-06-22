import { Router } from "express";
import { AuthController } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.validation";
import { validate } from "../../shared/middlewares/validateRequest";
import { AnyZodObject } from "zod/v3";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validate(registerSchema as unknown as AnyZodObject),
  authController.register,
);
router.post(
  "/login",
  validate(loginSchema as unknown as AnyZodObject),
  authController.login,
);

export default router;
