import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";
import { AppError } from "../utils/AppError";

export const listAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { therapistId } = req.query as { therapistId?: string };
  const availability = await prisma.availability.findMany({
    where: therapistId ? { therapistId } : {},
    include: { therapist: { select: { id: true, name: true } } },
    orderBy: [{ therapistId: "asc" }, { dayOfWeek: "asc" }],
  });
  res.json({ availability });
});

export const createAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { therapistId, dayOfWeek, startTime, endTime, slotDurationMinutes, active } = req.body;

  if (startTime >= endTime) {
    throw new AppError("Start time must be before end time.", 400);
  }

  const availability = await prisma.availability.create({
    data: {
      therapistId,
      dayOfWeek,
      startTime,
      endTime,
      slotDurationMinutes: slotDurationMinutes ?? 30,
      active: active ?? true,
    },
  });
  res.status(201).json({ availability });
});

export const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.availability.findUnique({ where: { id } });
  if (!existing) throw new AppError("Availability entry not found.", 404);

  if (req.body.startTime && req.body.endTime && req.body.startTime >= req.body.endTime) {
    throw new AppError("Start time must be before end time.", 400);
  }

  const availability = await prisma.availability.update({ where: { id }, data: req.body });
  res.json({ availability });
});

export const deleteAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.availability.findUnique({ where: { id } });
  if (!existing) throw new AppError("Availability entry not found.", 404);

  await prisma.availability.delete({ where: { id } });
  res.json({ success: true });
});
