import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { serviceCatalogApi } from "../../services/serviceCatalog";
import { SERVICE_CATEGORY_LABELS, type Service, type ServiceCategory } from "../../types";

const CATEGORIES: ServiceCategory[] = ["SPEECH_THERAPY", "AUDIOLOGY", "STROKE_REHAB", "HOME_BASED"];

const emptyForm = { name: "", category: "SPEECH_THERAPY" as ServiceCategory, description: "", active: true };

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    serviceCatalogApi
      .list(true)
      .then((res) => setServices(res.services))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load services."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({ name: service.name, category: service.category, description: service.description, active: service.active });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim()) {
      setFormError("Please fill in the name and description.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await serviceCatalogApi.update(editing.id, form);
      } else {
        await serviceCatalogApi.create(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save service.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(service: Service) {
    await serviceCatalogApi.update(service.id, { active: !service.active });
    load();
  }

  async function handleDelete(service: Service) {
    const confirmed = window.confirm(
      `Remove "${service.name}"? If it has existing appointments, it'll be deactivated instead of deleted.`,
    );
    if (!confirmed) return;
    await serviceCatalogApi.remove(service.id);
    load();
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Services</h1>
          <p className="mt-1 text-sm text-brand-ink/60">Manage the services shown on the public Services page.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} aria-hidden="true" /> Add Service
        </Button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-brand-ink/60">Loading…</p>
        ) : (
          <DataTable
            keyField={(s) => s.id}
            rows={services}
            emptyMessage="No services yet. Add one to get started."
            columns={[
              { header: "Name", render: (s) => <span className="font-medium text-brand-ink">{s.name}</span> },
              { header: "Category", render: (s) => SERVICE_CATEGORY_LABELS[s.category] },
              {
                header: "Status",
                render: (s) => (
                  <button
                    onClick={() => toggleActive(s)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      s.active ? "bg-emerald-100 text-emerald-700" : "bg-brand-ink/10 text-brand-ink/50"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </button>
                ),
              },
              {
                header: "Actions",
                render: (s) => (
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(s)} className="text-brand-blue hover:text-brand-blue-dark" aria-label={`Edit ${s.name}`}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-rose-500 hover:text-rose-700" aria-label={`Delete ${s.name}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Service" : "Add Service"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="service-name" className="mb-1 block text-sm font-medium text-brand-ink">Name</label>
            <input
              id="service-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
            />
          </div>
          <div>
            <label htmlFor="service-category" className="mb-1 block text-sm font-medium text-brand-ink">Category</label>
            <select
              id="service-category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{SERVICE_CATEGORY_LABELS[category]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="service-description" className="mb-1 block text-sm font-medium text-brand-ink">Description</label>
            <textarea
              id="service-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
            />
          </div>
          {formError && <p className="text-sm text-rose-600">{formError}</p>}
          <Button onClick={handleSave} disabled={saving} className="w-full justify-center">
            {saving ? "Saving…" : "Save Service"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
