import dotenv from "dotenv";

dotenv.config();

const requireString = (key: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
};

const optionalString = (key: string, fallback: string): string => {
  return process.env[key]?.trim() || fallback;
};

const requirePort = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed))
    throw new Error(`Environment variable ${key} must be a valid port number`);
  return parsed;
};

export const env = {
  PORT: requirePort("PORT", 3000),
  JWT_SECRET: requireString("JWT_SECRET"),
  JWT_EXPIRES_IN: requireString("JWT_EXPIRES_IN"),
  MONGODB_URI: requireString("MONGODB_URI"),
};
