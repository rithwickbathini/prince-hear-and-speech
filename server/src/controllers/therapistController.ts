import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";
import { AppError } from "../utils/AppError";

export const listTherapists = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.all === "true";
  const therapists = await prisma.therapist.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: { name: "asc" },
  });
  res.json({ therapists });
});

export const createTherapist = asyncHandler(async (req: Request, res: Response) => {
  const { name, qualification, specialization, bio, image, active } = req.body;
  const therapist = await prisma.therapist.create({
    data: { name, qualification, specialization, bio, image, active: active ?? true },
  });
  res.status(201).json({ therapist });
});

export const updateTherapist = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.therapist.findUnique({ where: { id } });
  if (!existing) throw new AppError("Therapist not found.", 404);

  const therapist = await prisma.therapist.update({ where: { id }, data: req.body });
  res.json({ therapist });
});

export const deleteTherapist = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.therapist.findUnique({ where: { id } });
  if (!existing) throw new AppError("Therapist not found.", 404);

  const appointmentCount = await prisma.appointment.count({ where: { therapistId: id } });
  if (appointmentCount > 0) {
    await prisma.therapist.update({ where: { id }, data: { active: false } });
    return res.json({ success: true, deactivated: true });
  }

  await prisma.availability.deleteMany({ where: { therapistId: id } });
  await prisma.therapist.delete({ where: { id } });
  res.json({ success: true, deactivated: false });
});
