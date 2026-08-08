import { CalendarClock, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppointments } from "../../hooks/useAppointments";
import { dashboardApi, type DashboardSummary } from "../../services/dashboard";
import { formatDisplayDate, formatDisplayTime } from "../../utils/date";

const KPI_CONFIG = [
  { key: "total" as const, label: "Total Appointments", icon: ListChecks },
  { key: "pending" as const, label: "Pending", icon: Clock3 },
  { key: "confirmed" as const, label: "Confirmed", icon: CalendarClock },
  { key: "completed" as const, label: "Completed", icon: CheckCircle2 },
];

function MonthCalendar({ appointmentDates }: { appointmentDates: Map<string, number> }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay();
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-brand-ink">
        {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-1 font-semibold text-brand-ink/40">{day}</div>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = appointmentDates.get(dateKey) ?? 0;
          const isToday = day === today.getDate();
          return (
            <div
              key={dateKey}
              className={`relative rounded-lg py-2 ${isToday ? "bg-brand-blue text-white" : count > 0 ? "bg-brand-sky-light text-brand-ink" : "text-brand-ink/60"}`}
            >
              {day}
              {count > 0 && !isToday && (
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-pink" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const { appointments } = useAppointments();

  useEffect(() => {
    dashboardApi
      .summary()
      .then(setSummary)
      .catch((err) => setSummaryError(err instanceof Error ? err.message : "Could not load dashboard data."));
  }, []);

  const appointmentDates = new Map<string, number>();
  for (const appointment of appointments) {
    const key = appointment.appointmentDate.slice(0, 10);
    appointmentDates.set(key, (appointmentDates.get(key) ?? 0) + 1);
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-brand-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-ink/60">An overview of appointments across the clinic.</p>

      {summaryError && <p className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{summaryError}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-2xl border border-brand-sky/40 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">{label}</p>
              <Icon size={18} className="text-brand-blue" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-brand-ink">{summary ? summary[key] : "–"}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-sky/40 bg-white p-6 lg:col-span-1">
          <MonthCalendar appointmentDates={appointmentDates} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-brand-ink">Recent Appointments</h2>
          <DataTable
            columns={[
              { header: "Patient", render: (a) => a.patientName },
              { header: "Service", render: (a) => a.service?.name ?? "—" },
              { header: "Date", render: (a) => formatDisplayDate(a.appointmentDate) },
              { header: "Time", render: (a) => formatDisplayTime(a.appointmentTime) },
              { header: "Status", render: (a) => <StatusBadge status={a.status} /> },
            ]}
            rows={summary?.recent ?? []}
            keyField={(a) => a.id}
            emptyMessage="No appointments yet."
          />
        </div>
      </div>
    </div>
  );
}
