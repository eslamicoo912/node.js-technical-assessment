import express, { Application, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./shared/middlewares/error";

const app: Application = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is running" });
});

// --- Routes ---
app.use("/api/v1/auth", authRoutes);

// -- Global Error Handler ---
app.use(globalErrorHandler);

export default app;
