import { CalendarClock, CheckCircle2, ChevronLeft, ChevronRight, Clock3, ListChecks } from "lucide-react";
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

function MonthCalendar({
  year,
  month,
  onMonthChange,
  appointmentDates,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  appointmentDates: Map<string, number>;
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
}) {
  const today = new Date();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay();
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    onMonthChange(next.getFullYear(), next.getMonth());
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg p-1 text-brand-ink/50 hover:bg-brand-sky-light hover:text-brand-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-brand-ink">
          {firstOfMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Next month"
          className="rounded-lg p-1 text-brand-ink/50 hover:bg-brand-sky-light hover:text-brand-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-1 font-semibold text-brand-ink/40">{day}</div>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = appointmentDates.get(dateKey) ?? 0;
          const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          const isSelected = dateKey === selectedDate;
          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`relative rounded-lg py-2 transition-colors ${
                isSelected
                  ? "bg-brand-blue-dark text-white"
                  : isToday
                    ? "bg-brand-blue text-white"
                    : count > 0
                      ? "bg-brand-sky-light text-brand-ink hover:bg-brand-sky"
                      : "text-brand-ink/60 hover:bg-brand-sky-light/50"
              }`}
            >
              {day}
              {count > 0 && !isToday && !isSelected && (
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-pink" />
              )}
            </button>
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

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  function selectDate(dateKey: string) {
    setSelectedDate((current) => (current === dateKey ? null : dateKey));
  }

  const selectedDateAppointments = selectedDate
    ? appointments.filter((a) => a.appointmentDate.slice(0, 10) === selectedDate)
    : [];

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
          <MonthCalendar
            year={viewYear}
            month={viewMonth}
            onMonthChange={(y, m) => {
              setViewYear(y);
              setViewMonth(m);
            }}
            appointmentDates={appointmentDates}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-ink">
              {selectedDate ? `Appointments on ${formatDisplayDate(selectedDate)}` : "Recent Appointments"}
            </h2>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <DataTable
            columns={[
              { header: "Patient", render: (a) => a.patientName },
              { header: "Service", render: (a) => a.service?.name ?? "—" },
              { header: "Date", render: (a) => formatDisplayDate(a.appointmentDate) },
              { header: "Time", render: (a) => formatDisplayTime(a.appointmentTime) },
              { header: "Status", render: (a) => <StatusBadge status={a.status} /> },
            ]}
            rows={selectedDate ? selectedDateAppointments : (summary?.recent ?? [])}
            keyField={(a) => a.id}
            emptyMessage={selectedDate ? "No appointments on this date." : "No appointments yet."}
          />
        </div>
      </div>
    </div>
  );
}
