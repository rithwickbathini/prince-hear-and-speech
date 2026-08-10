const IST_TIME_ZONE = "Asia/Kolkata";

/** Clinic operating hours, in minutes from midnight IST. Bookable slots must start in [OPEN, CLOSE). */
export const CLINIC_OPEN_MINUTES = 9 * 60; // 9:00 AM
export const CLINIC_CLOSE_MINUTES = 19 * 60; // 7:00 PM

const istFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Reads the wall-clock IST date/time for a given instant, independent of the server's local timezone. */
function istParts(instant: Date): { dateStr: string; hour: number; minute: number } {
  const parts = Object.fromEntries(istFormatter.formatToParts(instant).map((p) => [p.type, p.value]));
  const hour = Number(parts.hour) % 24; // Intl can emit "24" for midnight with hour12:false
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    hour,
    minute: Number(parts.minute),
  };
}

/** Today's calendar date in IST, as YYYY-MM-DD. */
export function todayIST(instant: Date = new Date()): string {
  return istParts(instant).dateStr;
}

/** Current wall-clock time in IST, in minutes since midnight. */
export function nowMinutesIST(instant: Date = new Date()): number {
  const { hour, minute } = istParts(instant);
  return hour * 60 + minute;
}

export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** True when `minutes` (0-1439) falls within the clinic's 9:00 AM - 7:00 PM window. */
export function isWithinClinicHours(minutes: number): boolean {
  return minutes >= CLINIC_OPEN_MINUTES && minutes < CLINIC_CLOSE_MINUTES;
}
