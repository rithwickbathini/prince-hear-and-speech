import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("Server misconfiguration: JWT_SECRET is not set.", 500);
  }
  return secret;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign(payload, getJwtSecret(), { expiresIn } as jwt.SignOptions);
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
}
