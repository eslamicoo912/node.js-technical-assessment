import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  let statusCode = 500;
  let status = "error";
  let message = "server error";
  let errors: unknown = undefined;

  // check if it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  }

  // catch mongoose duplicate key errors
  if ((err as any).code === 11000) {
    statusCode = 400;
    status = "fail";
    const duplicateField = Object.keys((err as any).keyValue)[0];
    message = `The ${duplicateField} is already registered. Please try another one.`;
  }

  if (statusCode === 500) {
    console.error("CRITICAL UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    status,
    message,
    ...(errors ? { errors } : {}),
  });
};
