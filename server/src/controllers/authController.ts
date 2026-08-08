import { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthedRequest } from "../middleware/requireAuth";
import { prisma } from "../models/prisma";
import { AppError } from "../utils/AppError";
import { signAdminToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";

const COOKIE_NAME = "admin_token";

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) throw new AppError("Invalid email or password.", 401);

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw new AppError("Invalid email or password.", 401);

  const token = signAdminToken({ adminId: admin.id, email: admin.email });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ success: true });
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.adminId } });
  if (!admin) throw new AppError("Admin not found.", 404);
  res.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
});
