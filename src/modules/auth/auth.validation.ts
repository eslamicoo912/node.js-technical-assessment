import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters long" })
      .trim(),
    email: z
      .email({ message: "Please provide a valid email address" })
      .lowercase()
      .trim(),
    password: z
      .string({ error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email({ message: "Please provide a valid email address" })
      .lowercase()
      .trim(),
    password: z.string({ error: "Password is required" }),
  }),
});
