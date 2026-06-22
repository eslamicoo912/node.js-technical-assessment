import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  // check if the request headers contains a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(
      new AppError(
        "You are not logged in. Please provide a token to gain access.",
        401,
      ),
    );
    return;
  }

  // verify the token
  const decoded = verifyToken(token);
  if (!decoded) {
    next(
      new AppError(
        "Invalid or expired authentication token. Please log in again.",
        401,
      ),
    );
    return;
  }

  // 3. attach the user to the request
  req.user = decoded;

  next();
};
