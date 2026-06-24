import type { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod/v3";

export function validate(schema: AnyZodObject) {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: request.body,
        query: request.query,
        params: request.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
}
