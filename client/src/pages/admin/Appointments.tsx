import { useState } from "react";
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

  async function submitReschedule() {
    if (!rescheduling) return;
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
              { header: "Patient", render: (a) => <span className="font-medium text-brand-ink">{a.patientName}</span> },
              { header: "Phone", render: (a) => a.phone },
              { header: "Service", render: (a) => a.service?.name ?? "—" },
              { header: "Therapist", render: (a) => a.therapist?.name ?? "—" },
              { header: "Date", render: (a) => formatDisplayDate(a.appointmentDate) },
              { header: "Time", render: (a) => formatDisplayTime(a.appointmentTime) },
              { header: "Home Visit", render: (a) => (a.homeVisit ? "Yes" : "No") },
              { header: "Status", render: (a) => <StatusBadge status={a.status} /> },
              {
                header: "Actions",
                render: (a) => (
                  <div className="flex flex-wrap gap-2">
                    {a.status === "PENDING" && (
                      <button
                        disabled={savingId === a.id}
                        onClick={() => updateStatus(a.id, "CONFIRMED")}
                        className="text-xs font-semibold text-brand-blue hover:underline disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {a.status === "CONFIRMED" && (
                      <button
                        disabled={savingId === a.id}
                        onClick={() => updateStatus(a.id, "COMPLETED")}
                        className="text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                    {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                      <>
                        <button
                          disabled={savingId === a.id}
                          onClick={() => openReschedule(a)}
                          className="text-xs font-semibold text-brand-ink/60 hover:underline disabled:opacity-50"
                        >
                          Reschedule
                        </button>
                        <button
                          disabled={savingId === a.id}
                          onClick={() => updateStatus(a.id, "CANCELLED")}
                          className="text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
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
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
            />
          </div>
          <div>
            <label htmlFor="reschedule-time" className="mb-1 block text-sm font-medium text-brand-ink">New time</label>
            <input
              id="reschedule-time"
              type="time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
            />
          </div>
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
