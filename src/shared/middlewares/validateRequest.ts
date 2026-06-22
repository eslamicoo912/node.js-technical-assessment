import type { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod/v3";

export function validate(schema: AnyZodObject) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    request.body = result?.data?.body ?? request.body;
    request.params = result?.data?.params ?? request.params;

    if (result.data?.query) {
      Object.assign(request.query, result.data.query);
    }

    next();
  };
}
