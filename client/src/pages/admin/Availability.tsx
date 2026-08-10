import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { useTherapists } from "../../hooks/useTherapists";
import { availabilityApi } from "../../services/availability";
import { DAY_LABELS, type Availability } from "../../types";

const emptyForm = { dayOfWeek: "1", startTime: "09:00", endTime: "17:00", slotDurationMinutes: "30" };

export default function AdminAvailability() {
  const { therapists, loading: therapistsLoading } = useTherapists();
  const [therapistId, setTherapistId] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!therapistId && therapists.length > 0) setTherapistId(therapists[0].id);
  }, [therapists, therapistId]);

  function load(id: string) {
    if (!id) return;
    setLoading(true);
    availabilityApi
      .list(id)
      .then((res) => setAvailability(res.availability))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load availability."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(therapistId);
  }, [therapistId]);

  function openAdd() {
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!therapistId) return;
    if (form.startTime >= form.endTime) {
      setFormError("Start time must be before end time.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await availabilityApi.create({
        therapistId,
        dayOfWeek: Number(form.dayOfWeek),
        startTime: form.startTime,
        endTime: form.endTime,
        slotDurationMinutes: Number(form.slotDurationMinutes) || 30,
      });
      setModalOpen(false);
      load(therapistId);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save availability.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(entry: Availability) {
    await availabilityApi.update(entry.id, { active: !entry.active });
    load(therapistId);
  }

  async function handleDelete(entry: Availability) {
    const confirmed = window.confirm("Remove this availability window?");
    if (!confirmed) return;
    await availabilityApi.remove(entry.id);
    load(therapistId);
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Availability</h1>
          <p className="mt-1 text-sm text-brand-ink/60">Set each therapist&apos;s weekly working hours and slot length.</p>
        </div>
        <Button onClick={openAdd} disabled={!therapistId}>
          <Plus size={16} aria-hidden="true" /> Add Availability
        </Button>
      </div>

      <div className="mt-6 max-w-xs">
        <label htmlFor="availability-therapist" className="mb-1 block text-sm font-medium text-brand-ink">Therapist</label>
        <select
          id="availability-therapist"
          value={therapistId}
          onChange={(e) => setTherapistId(e.target.value)}
          disabled={therapistsLoading}
          className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
        >
          {therapists.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-brand-ink/60">Loading…</p>
        ) : (
          <DataTable
            keyField={(a) => a.id}
            rows={availability}
            emptyMessage="No availability set for this therapist yet."
            columns={[
              { header: "Day", render: (a) => DAY_LABELS[a.dayOfWeek] },
              { header: "Start", render: (a) => a.startTime },
              { header: "End", render: (a) => a.endTime },
              { header: "Slot Length", render: (a) => `${a.slotDurationMinutes} min` },
              {
                header: "Status",
                render: (a) => (
                  <button
                    onClick={() => toggleActive(a)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.active ? "bg-emerald-100 text-emerald-700" : "bg-brand-ink/10 text-brand-ink/50"
                    }`}
                  >
                    {a.active ? "Active" : "Inactive"}
                  </button>
                ),
              },
              {
                header: "Actions",
                render: (a) => (
                  <button onClick={() => handleDelete(a)} className="-my-2 rounded-full p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700" aria-label="Delete availability window">
                    <Trash2 size={15} />
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Availability">
        <div className="space-y-4">
          <div>
            <label htmlFor="avail-day" className="mb-1 block text-sm font-medium text-brand-ink">Day of week</label>
            <select
              id="avail-day"
              value={form.dayOfWeek}
              onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
            >
              {DAY_LABELS.map((label, index) => (
                <option key={label} value={index}>{label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="avail-start" className="mb-1 block text-sm font-medium text-brand-ink">Start time</label>
              <input
                id="avail-start"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="avail-end" className="mb-1 block text-sm font-medium text-brand-ink">End time</label>
              <input
                id="avail-end"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
          </div>
          <div>
            <label htmlFor="avail-duration" className="mb-1 block text-sm font-medium text-brand-ink">Slot duration (minutes)</label>
            <input
              id="avail-duration"
              type="number"
              min={5}
              step={5}
              value={form.slotDurationMinutes}
              onChange={(e) => setForm((f) => ({ ...f, slotDurationMinutes: e.target.value }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
            />
          </div>
          {formError && <p className="text-sm text-rose-600">{formError}</p>}
          <Button onClick={handleSave} disabled={saving} className="w-full justify-center">
            {saving ? "Saving…" : "Save Availability"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
