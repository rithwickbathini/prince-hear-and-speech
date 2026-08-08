import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAdminToken } from "../utils/jwt";

export interface AuthedRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_token as string | undefined;
  if (!token) {
    return next(new AppError("Authentication required.", 401));
  }
  try {
    const payload = verifyAdminToken(token);
    req.adminId = payload.adminId;
    req.adminEmail = payload.email;
    next();
  } catch {
    return next(new AppError("Your session has expired. Please log in again.", 401));
  }
}
