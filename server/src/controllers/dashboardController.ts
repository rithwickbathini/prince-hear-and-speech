import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [total, pending, confirmed, completed, cancelled, recent] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { service: true, therapist: true },
    }),
  ]);

  res.json({ total, pending, confirmed, completed, cancelled, recent });
});
