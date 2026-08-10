import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler";
import { prisma } from "../models/prisma";
import { computeFreeSlots } from "../services/slotService";
import { AppError } from "../utils/AppError";
import { generatePublicId } from "../utils/publicId";
import { isWithinClinicHours, nowMinutesIST, timeStringToMinutes, todayIST } from "../utils/ist";

/** True when a P2002 unique-constraint error was raised on the given column/index. */
function isUniqueConstraintErrorOn(error: unknown, needle: string): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return false;
  const target = error.meta?.target;
  const targetStr = Array.isArray(target) ? target.join(",") : String(target ?? "");
  return targetStr.includes(needle);
}

/**
 * Validates that (dateStr, timeStr) is a bookable slot: not a past date, within clinic
 * hours (9 AM - 7 PM IST), and — if the date is today in IST — not already passed.
 * This is the server-side source of truth; the frontend cannot bypass it.
 */
function assertBookableSlot(dateStr: string, timeStr: string) {
  const today = todayIST();
  if (dateStr < today) throw new AppError("Cannot book an appointment on a past date.", 400);

  const minutes = timeStringToMinutes(timeStr);
  if (Number.isNaN(minutes) || !isWithinClinicHours(minutes)) {
    throw new AppError("Appointments are only available between 9:00 AM and 7:00 PM.", 400);
  }

  if (dateStr === today && minutes <= nowMinutesIST()) {
    throw new AppError("That time slot has already passed. Please choose a later time.", 400);
  }
}

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const { therapistId, date, excludeAppointmentId } = req.query as {
    therapistId?: string;
    date?: string;
    excludeAppointmentId?: string;
  };
  if (!therapistId || !date) throw new AppError("therapistId and date are required.", 400);

  const slots = await computeFreeSlots(therapistId, date, excludeAppointmentId);
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

  assertBookableSlot(appointmentDate, appointmentTime);

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

  const data = {
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
  };

  // The findFirst conflict check above has a race window between two concurrent requests;
  // the DB-level partial unique index (appointments_active_slot_key) is the real guard.
  // publicId collisions are vanishingly unlikely (1 in 10,000) but are retried safely too.
  const MAX_ATTEMPTS = 10;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const appointment = await prisma.appointment.create({
        data: { ...data, publicId: generatePublicId() },
        include: { service: true, therapist: true },
      });
      return res.status(201).json({ appointment });
    } catch (error) {
      if (isUniqueConstraintErrorOn(error, "active_slot")) {
        throw new AppError("That time slot was just booked. Please choose another.", 409);
      }
      if (isUniqueConstraintErrorOn(error, "publicId") && attempt < MAX_ATTEMPTS) {
        continue; // regenerate and retry
      }
      throw error;
    }
  }
  throw new AppError("Could not generate a unique appointment ID. Please try again.", 500);
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

  assertBookableSlot(appointmentDate, appointmentTime);

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

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { appointmentDate: dateObj, appointmentTime, status: "PENDING", rescheduled: true },
      include: { service: true, therapist: true },
    });
    res.json({ appointment });
  } catch (error) {
    if (isUniqueConstraintErrorOn(error, "active_slot")) {
      throw new AppError("That time slot was just booked. Please choose another.", 409);
    }
    throw error;
  }
});
