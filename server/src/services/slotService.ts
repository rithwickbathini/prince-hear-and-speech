import { prisma } from "../models/prisma";

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Computes free appointment slots for a therapist on a given calendar date (YYYY-MM-DD). */
export async function computeFreeSlots(therapistId: string, dateStr: string): Promise<string[]> {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return [];

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
    },
    select: { appointmentTime: true },
  });
  const bookedTimes = new Set(booked.map((appointment) => appointment.appointmentTime));

  const slots = new Set<string>();
  for (const availability of availabilities) {
    const start = toMinutes(availability.startTime);
    const end = toMinutes(availability.endTime);
    for (let cursor = start; cursor + availability.slotDurationMinutes <= end; cursor += availability.slotDurationMinutes) {
      const label = toTimeLabel(cursor);
      if (!bookedTimes.has(label)) slots.add(label);
    }
  }

  return Array.from(slots).sort();
}
