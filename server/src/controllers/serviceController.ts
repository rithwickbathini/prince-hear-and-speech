import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";
import { AppError } from "../utils/AppError";

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.all === "true";
  const services = await prisma.service.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  res.json({ services });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, description, active } = req.body;
  const service = await prisma.service.create({
    data: { name, category, description, active: active ?? true },
  });
  res.status(201).json({ service });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found.", 404);

  const service = await prisma.service.update({ where: { id }, data: req.body });
  res.json({ service });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found.", 404);

  const appointmentCount = await prisma.appointment.count({ where: { serviceId: id } });
  if (appointmentCount > 0) {
    await prisma.service.update({ where: { id }, data: { active: false } });
    return res.json({ success: true, deactivated: true });
  }

  await prisma.service.delete({ where: { id } });
  res.json({ success: true, deactivated: false });
});
