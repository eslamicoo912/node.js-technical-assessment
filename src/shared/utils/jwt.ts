import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET ?? "fallback_secret_key";
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN ?? "1d";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (
  payload: { userId: string; role: string }
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
};