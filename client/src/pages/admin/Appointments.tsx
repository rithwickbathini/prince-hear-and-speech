import { useEffect, useState } from "react";
import { ApiError } from "../../services/api";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppointments } from "../../hooks/useAppointments";
import { appointmentsApi } from "../../services/appointments";
import type { Appointment, AppointmentStatus } from "../../types";
import { formatDisplayDate, formatDisplayTime, minDateInputValue } from "../../utils/date";

const TABS: { label: string; value?: AppointmentStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminAppointments() {
  const [tab, setTab] = useState<AppointmentStatus | undefined>(undefined);
  const { appointments, loading, error, refresh } = useAppointments(tab);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleSlotsError, setRescheduleSlotsError] = useState<string | null>(null);

  useEffect(() => {
    if (!rescheduling?.therapistId || !rescheduleDate) {
      setRescheduleSlots([]);
      return;
    }
    let active = true;
    setRescheduleSlotsLoading(true);
    setRescheduleSlotsError(null);
    appointmentsApi
      .getSlots(rescheduling.therapistId, rescheduleDate, rescheduling.id)
      .then((res) => {
        if (active) setRescheduleSlots(res.slots);
      })
      .catch((err) => {
        if (active) setRescheduleSlotsError(err instanceof ApiError ? err.message : "Could not load available times.");
      })
      .finally(() => {
        if (active) setRescheduleSlotsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [rescheduling, rescheduleDate]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setActionError(null);
    setSavingId(id);
    try {
      await appointmentsApi.updateStatus(id, status);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the appointment.");
    } finally {
      setSavingId(null);
    }
  }

  function openReschedule(appointment: Appointment) {
    setRescheduling(appointment);
    setRescheduleDate(appointment.appointmentDate.slice(0, 10));
    setRescheduleTime(appointment.appointmentTime);
  }

  function changeRescheduleDate(date: string) {
    setRescheduleDate(date);
    setRescheduleTime(""); // times from the previous date are no longer valid
  }

  async function submitReschedule() {
    if (!rescheduling) return;
    if (!rescheduleDate || !rescheduleTime) {
      setActionError("Please choose both a date and a time.");
      return;
    }
    setActionError(null);
    setSavingId(rescheduling.id);
    try {
      await appointmentsApi.reschedule(rescheduling.id, rescheduleDate, rescheduleTime);
      setRescheduling(null);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not reschedule the appointment.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-brand-ink">Appointments</h1>
      <p className="mt-1 text-sm text-brand-ink/60">Review, confirm, and manage patient appointment requests.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.value ? "bg-brand-blue text-white" : "bg-white text-brand-ink/70 hover:bg-brand-sky-light"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {actionError && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{actionError}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-brand-ink/60">Loading appointments…</p>
        ) : (
          <DataTable
            keyField={(a) => a.id}
            rows={appointments}
            emptyMessage="No appointments in this view yet."
            columns={[
              { header: "ID", render: (a) => <span className="font-mono text-xs text-brand-ink/70">{a.publicId}</span> },
              { header: "Patient", render: (a) => <span className="font-medium text-brand-ink">{a.patientName}</span> },
              { header: "Phone", render: (a) => a.phone },
              { header: "Service", render: (a) => a.service?.name ?? "—" },
              { header: "Specialist", render: (a) => a.therapist?.name ?? "—" },
              { header: "Date", render: (a) => formatDisplayDate(a.appointmentDate) },
              { header: "Time", render: (a) => formatDisplayTime(a.appointmentTime) },
              { header: "Home Visit", render: (a) => (a.homeVisit ? "Yes" : "No") },
              { header: "Status", render: (a) => <StatusBadge status={a.status} /> },
              {
                header: "Rescheduled",
                render: (a) => (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      a.rescheduled ? "bg-amber-100 text-amber-700" : "bg-brand-ink/5 text-brand-ink/50"
                    }`}
                  >
                    {a.rescheduled ? "Yes" : "No"}
                  </span>
                ),
              },
              {
                header: "Actions",
                render: (a) => (
                  <div className="flex flex-wrap gap-1">
                    {a.status === "PENDING" && (
                      <button
                        disabled={savingId === a.id}
                        onClick={() => updateStatus(a.id, "CONFIRMED")}
                        className="rounded-md px-2 py-2 text-xs font-semibold text-brand-blue hover:underline disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {a.status === "CONFIRMED" && (
                      <button
                        disabled={savingId === a.id}
                        onClick={() => updateStatus(a.id, "COMPLETED")}
                        className="rounded-md px-2 py-2 text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                    {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                      <>
                        <button
                          disabled={savingId === a.id}
                          onClick={() => openReschedule(a)}
                          className="rounded-md px-2 py-2 text-xs font-semibold text-brand-ink/60 hover:underline disabled:opacity-50"
                        >
                          Reschedule
                        </button>
                        <button
                          disabled={savingId === a.id}
                          onClick={() => updateStatus(a.id, "CANCELLED")}
                          className="rounded-md px-2 py-2 text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={!!rescheduling} onClose={() => setRescheduling(null)} title="Reschedule Appointment">
        <div className="space-y-4">
          <div>
            <label htmlFor="reschedule-date" className="mb-1 block text-sm font-medium text-brand-ink">New date</label>
            <input
              id="reschedule-date"
              type="date"
              min={minDateInputValue()}
              value={rescheduleDate}
              onChange={(e) => changeRescheduleDate(e.target.value)}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
            />
          </div>

          {rescheduling?.therapistId ? (
            <div>
              <p className="mb-1 block text-sm font-medium text-brand-ink">New time</p>
              {rescheduleSlotsLoading && <p className="text-sm text-brand-ink/60">Checking availability…</p>}
              {rescheduleSlotsError && <p className="text-sm text-rose-600">{rescheduleSlotsError}</p>}
              {!rescheduleSlotsLoading && !rescheduleSlotsError && rescheduleSlots.length === 0 && (
                <p className="text-sm text-brand-ink/60">No available times on this date.</p>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {rescheduleSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setRescheduleTime(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      rescheduleTime === slot
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-brand-sky/40 text-brand-ink hover:border-brand-blue/50"
                    }`}
                  >
                    {formatDisplayTime(slot)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="reschedule-time" className="mb-1 block text-sm font-medium text-brand-ink">New time</label>
              <input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
              <p className="mt-1 text-xs text-brand-ink/50">Must be between 9:00 AM and 7:00 PM IST.</p>
            </div>
          )}
          <button
            type="button"
            onClick={submitReschedule}
            disabled={savingId === rescheduling?.id}
            className="w-full rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50"
          >
            {savingId === rescheduling?.id ? "Saving…" : "Save New Time"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
