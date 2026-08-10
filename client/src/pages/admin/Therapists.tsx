import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { therapistsApi } from "../../services/therapists";
import type { Therapist } from "../../types";

const emptyForm = { name: "", qualification: "", specialization: "", bio: "", image: "", active: true };

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-brand-ink">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
      />
    </div>
  );
}

export default function AdminTherapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Therapist | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    therapistsApi
      .list(true)
      .then((res) => setTherapists(res.therapists))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load therapists."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(therapist: Therapist) {
    setEditing(therapist);
    setForm({
      name: therapist.name,
      qualification: therapist.qualification,
      specialization: therapist.specialization,
      bio: therapist.bio,
      image: therapist.image ?? "",
      active: therapist.active,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.qualification.trim() || !form.specialization.trim() || !form.bio.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await therapistsApi.update(editing.id, form);
      } else {
        await therapistsApi.create(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save therapist.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(therapist: Therapist) {
    await therapistsApi.update(therapist.id, { active: !therapist.active });
    load();
  }

  async function handleDelete(therapist: Therapist) {
    const confirmed = window.confirm(
      `Remove ${therapist.name}? If they have existing appointments, they'll be deactivated instead of deleted.`,
    );
    if (!confirmed) return;
    await therapistsApi.remove(therapist.id);
    load();
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Therapists</h1>
          <p className="mt-1 text-sm text-brand-ink/60">Manage the team shown on the public Therapists page.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} aria-hidden="true" /> Add Therapist
        </Button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-brand-ink/60">Loading…</p>
        ) : (
          <DataTable
            keyField={(t) => t.id}
            rows={therapists}
            emptyMessage="No therapists yet. Add one to get started."
            columns={[
              { header: "Name", render: (t) => <span className="font-medium text-brand-ink">{t.name}</span> },
              { header: "Qualification", render: (t) => t.qualification },
              { header: "Specialization", render: (t) => t.specialization },
              {
                header: "Status",
                render: (t) => (
                  <button
                    onClick={() => toggleActive(t)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      t.active ? "bg-emerald-100 text-emerald-700" : "bg-brand-ink/10 text-brand-ink/50"
                    }`}
                  >
                    {t.active ? "Active" : "Inactive"}
                  </button>
                ),
              },
              {
                header: "Actions",
                render: (t) => (
                  <div className="-my-2 flex gap-1">
                    <button onClick={() => openEdit(t)} className="rounded-full p-2 text-brand-blue hover:bg-brand-sky-light hover:text-brand-blue-dark" aria-label={`Edit ${t.name}`}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(t)} className="rounded-full p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${t.name}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Therapist" : "Add Therapist"}>
        <div className="space-y-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Field label="Qualification" value={form.qualification} onChange={(v) => setForm((f) => ({ ...f, qualification: v }))} />
          <Field label="Specialization" value={form.specialization} onChange={(v) => setForm((f) => ({ ...f, specialization: v }))} />
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
            />
          </div>
          <Field label="Image URL (optional)" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
          {formError && <p className="text-sm text-rose-600">{formError}</p>}
          <Button onClick={handleSave} disabled={saving} className="w-full justify-center">
            {saving ? "Saving…" : "Save Therapist"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
