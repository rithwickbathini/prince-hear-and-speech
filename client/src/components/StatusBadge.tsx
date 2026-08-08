import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "../types";

const styles: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-brand-sky-light text-brand-blue-dark",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  );
}
