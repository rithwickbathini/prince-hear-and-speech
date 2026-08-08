import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";
import { computeFreeSlots } from "../services/slotService";
import { AppError } from "../utils/AppError";

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const { therapistId, date } = req.query as { therapistId?: string; date?: string };
  if (!therapistId || !date) throw new AppError("therapistId and date are required.", 400);

  const slots = await computeFreeSlots(therapistId, date);
  res.json({ slots });
});

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const {
    patientName,
    phone,
    email,
    age,
    serviceId,
    therapistId,
    appointmentDate,
    appointmentTime,
    homeVisit,
    message,
  } = req.body;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) throw new AppError("Selected service is not available.", 400);

  const dateObj = new Date(`${appointmentDate}T00:00:00.000Z`);
  if (Number.isNaN(dateObj.getTime())) throw new AppError("Invalid appointment date.", 400);

  if (therapistId) {
    const therapist = await prisma.therapist.findUnique({ where: { id: therapistId } });
    if (!therapist || !therapist.active) throw new AppError("Selected therapist is not available.", 400);

    const conflict = await prisma.appointment.findFirst({
      where: {
        therapistId,
        appointmentDate: dateObj,
        appointmentTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (conflict) throw new AppError("That time slot was just booked. Please choose another.", 409);
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientName,
      phone,
      email: email || null,
      age: age ? Number(age) : null,
      serviceId,
      therapistId: therapistId || null,
      appointmentDate: dateObj,
      appointmentTime,
      homeVisit: Boolean(homeVisit),
      message: message || null,
    },
    include: { service: true, therapist: true },
  });

  res.status(201).json({ appointment });
});

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  const where: Prisma.AppointmentWhereInput = status ? { status: status as Prisma.EnumAppointmentStatusFilter["equals"] } : {};

  const appointments = await prisma.appointment.findMany({
    where,
    include: { service: true, therapist: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError("Appointment not found.", 404);

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: { service: true, therapist: true },
  });
  res.json({ appointment });
});

export const rescheduleAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { appointmentDate, appointmentTime } = req.body;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError("Appointment not found.", 404);

  const dateObj = new Date(`${appointmentDate}T00:00:00.000Z`);
  if (Number.isNaN(dateObj.getTime())) throw new AppError("Invalid appointment date.", 400);

  if (existing.therapistId) {
    const conflict = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        therapistId: existing.therapistId,
        appointmentDate: dateObj,
        appointmentTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (conflict) throw new AppError("That time slot is already booked. Please choose another.", 409);
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { appointmentDate: dateObj, appointmentTime, status: "PENDING" },
    include: { service: true, therapist: true },
  });
  res.json({ appointment });
});
