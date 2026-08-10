import { prisma } from "../models/prisma";
import { CLINIC_CLOSE_MINUTES, CLINIC_OPEN_MINUTES, nowMinutesIST, timeStringToMinutes, todayIST } from "../utils/ist";

function toTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Computes free appointment slots for a therapist on a given calendar date (YYYY-MM-DD).
 * Slots are clamped to the clinic's 9:00 AM - 7:00 PM window (Asia/Kolkata), and for
 * today's date (in IST) any slot at or before the current IST time is excluded.
 */
export async function computeFreeSlots(
  therapistId: string,
  dateStr: string,
  excludeAppointmentId?: string,
): Promise<string[]> {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return [];

  const today = todayIST();
  if (dateStr < today) return []; // past dates are never bookable

  const dayOfWeek = date.getUTCDay();

  const availabilities = await prisma.availability.findMany({
    where: { therapistId, dayOfWeek, active: true },
  });
  if (availabilities.length === 0) return [];

  const booked = await prisma.appointment.findMany({
    where: {
      therapistId,
      appointmentDate: date,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
    },
    select: { appointmentTime: true },
  });
  const bookedTimes = new Set(booked.map((appointment) => appointment.appointmentTime));

  const isToday = dateStr === today;
  const nowMinutes = isToday ? nowMinutesIST() : -1;

  const slots = new Set<string>();
  for (const availability of availabilities) {
    const start = Math.max(timeStringToMinutes(availability.startTime), CLINIC_OPEN_MINUTES);
    const end = Math.min(timeStringToMinutes(availability.endTime), CLINIC_CLOSE_MINUTES);
    for (let cursor = start; cursor + availability.slotDurationMinutes <= end; cursor += availability.slotDurationMinutes) {
      if (isToday && cursor <= nowMinutes) continue; // already passed today (IST)
      const label = toTimeLabel(cursor);
      if (!bookedTimes.has(label)) slots.add(label);
    }
  }

  return Array.from(slots).sort();
}
