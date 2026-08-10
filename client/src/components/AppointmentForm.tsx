import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { appointmentsApi, type BookAppointmentInput } from "../services/appointments";
import { useServices } from "../hooks/useServices";
import { useTherapists } from "../hooks/useTherapists";
import { SERVICE_CATEGORY_LABELS } from "../types";
import type { Appointment } from "../types";
import { formatDisplayDate, formatDisplayTime, minDateInputValue } from "../utils/date";
import { isValidPhone } from "../utils/validators";
import { Button } from "./Button";
import { Card } from "./Card";

const STEPS = ["Service", "Therapist", "Date", "Time", "Details"] as const;

interface FormState {
  serviceId: string;
  therapistId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  phone: string;
  email: string;
  age: string;
  homeVisit: boolean;
  message: string;
}

const initialState: FormState = {
  serviceId: "",
  therapistId: "",
  appointmentDate: "",
  appointmentTime: "",
  patientName: "",
  phone: "",
  email: "",
  age: "",
  homeVisit: false,
  message: "",
};

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const state = stepNumber < step ? "done" : stepNumber === step ? "current" : "upcoming";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                state === "done"
                  ? "bg-brand-blue text-white"
                  : state === "current"
                    ? "bg-brand-pink text-brand-blue-dark"
                    : "bg-brand-sky-light text-brand-ink/40"
              }`}
            >
              {state === "done" ? <Check size={14} aria-hidden="true" /> : stepNumber}
            </span>
            <span className={`text-xs font-medium ${state === "upcoming" ? "text-brand-ink/40" : "text-brand-ink"}`}>
              {label}
            </span>
            {stepNumber < STEPS.length && <span className="mx-1 h-px w-6 bg-brand-sky/50" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const { therapists, loading: therapistsLoading, error: therapistsError } = useTherapists();

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 4 || !form.therapistId || !form.appointmentDate) return;
    let active = true;
    setSlotsLoading(true);
    setSlotsError(null);
    appointmentsApi
      .getSlots(form.therapistId, form.appointmentDate)
      .then((res) => {
        if (active) setSlots(res.slots);
      })
      .catch((err) => {
        if (active) setSlotsError(err instanceof ApiError ? err.message : "Could not load available times.");
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [step, form.therapistId, form.appointmentDate]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setStepError(null);
    if (step === 1 && !form.serviceId) return setStepError("Please select a service to continue.");
    if (step === 2 && !form.therapistId) return setStepError("Please select a therapist to continue.");
    if (step === 3 && !form.appointmentDate) return setStepError("Please select a date to continue.");
    if (step === 4 && !form.appointmentTime) return setStepError("Please select a time slot to continue.");
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    setStepError(null);

    if (!form.patientName.trim()) return setStepError("Please enter the patient's name.");
    if (!isValidPhone(form.phone)) return setStepError("Please enter a valid phone number.");

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: BookAppointmentInput = {
        patientName: form.patientName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        age: form.age.trim() || undefined,
        serviceId: form.serviceId,
        therapistId: form.therapistId,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        homeVisit: form.homeVisit,
        message: form.message.trim() || undefined,
      };
      const res = await appointmentsApi.create(payload);
      setConfirmed(res.appointment);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "We couldn't submit your appointment request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <Card className="mx-auto max-w-xl p-6 text-center sm:p-8">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={26} aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold text-brand-ink sm:text-2xl">Appointment Request Submitted Successfully</h2>
        <p className="mt-2 text-sm text-brand-ink/60">
          Our team will review your request and confirm your appointment shortly.
        </p>
        <dl className="mt-6 space-y-2 rounded-xl bg-brand-sky-light p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-brand-ink/60">Appointment ID</dt>
            <dd className="font-mono font-semibold text-brand-ink">{confirmed.publicId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-brand-ink/60">Service</dt>
            <dd className="font-medium text-brand-ink">{confirmed.service?.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-brand-ink/60">Date</dt>
            <dd className="font-medium text-brand-ink">{formatDisplayDate(confirmed.appointmentDate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-brand-ink/60">Time</dt>
            <dd className="font-medium text-brand-ink">{formatDisplayTime(confirmed.appointmentTime)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-brand-ink/60">Contact</dt>
            <dd className="font-medium text-brand-ink">{confirmed.phone}</dd>
          </div>
        </dl>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-ink">Select a service</h2>
          {servicesLoading && <p className="text-sm text-brand-ink/60">Loading services…</p>}
          {servicesError && <p className="text-sm text-rose-600">{servicesError}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => update("serviceId", service.id)}
                className={`rounded-xl border p-4 text-left text-sm transition-colors ${
                  form.serviceId === service.id
                    ? "border-brand-blue bg-brand-sky-light"
                    : "border-brand-sky/40 hover:border-brand-blue/50"
                }`}
              >
                <p className="font-semibold text-brand-ink">{service.name}</p>
                <p className="mt-1 text-xs text-brand-ink/50">{SERVICE_CATEGORY_LABELS[service.category]}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-ink">Select a therapist</h2>
          {therapistsLoading && <p className="text-sm text-brand-ink/60">Loading therapists…</p>}
          {therapistsError && <p className="text-sm text-rose-600">{therapistsError}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {therapists.map((therapist) => (
              <button
                key={therapist.id}
                type="button"
                onClick={() => update("therapistId", therapist.id)}
                className={`rounded-xl border p-4 text-left text-sm transition-colors ${
                  form.therapistId === therapist.id
                    ? "border-brand-blue bg-brand-sky-light"
                    : "border-brand-sky/40 hover:border-brand-blue/50"
                }`}
              >
                <p className="font-semibold text-brand-ink">{therapist.name}</p>
                <p className="mt-1 text-xs text-brand-ink/50">{therapist.specialization}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-ink">Select a date</h2>
          <label htmlFor="appointment-date" className="mb-1 block text-sm font-medium text-brand-ink">
            Preferred date
          </label>
          <input
            id="appointment-date"
            type="date"
            min={minDateInputValue()}
            value={form.appointmentDate}
            onChange={(e) => update("appointmentDate", e.target.value)}
            className="w-full max-w-xs rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
          />
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-ink">Select a time</h2>
          {slotsLoading && (
            <p className="flex items-center gap-2 text-sm text-brand-ink/60">
              <Loader2 size={15} className="animate-spin" aria-hidden="true" /> Checking availability…
            </p>
          )}
          {slotsError && <p className="text-sm text-rose-600">{slotsError}</p>}
          {!slotsLoading && !slotsError && slots.length === 0 && (
            <p className="text-sm text-brand-ink/60">
              No available times on this date. Please go back and choose a different date.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => update("appointmentTime", slot)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.appointmentTime === slot
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-sky/40 text-brand-ink hover:border-brand-blue/50"
                }`}
              >
                {formatDisplayTime(slot)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-ink">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="patient-name" className="mb-1 block text-sm font-medium text-brand-ink">
                Patient Name
              </label>
              <input
                id="patient-name"
                value={form.patientName}
                onChange={(e) => update("patientName", e.target.value)}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
                required
              />
            </div>
            <div>
              <label htmlFor="patient-phone" className="mb-1 block text-sm font-medium text-brand-ink">
                Phone Number
              </label>
              <input
                id="patient-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
                required
              />
            </div>
            <div>
              <label htmlFor="patient-email" className="mb-1 block text-sm font-medium text-brand-ink">
                Email <span className="font-normal text-brand-ink/40">(optional)</span>
              </label>
              <input
                id="patient-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="patient-age" className="mb-1 block text-sm font-medium text-brand-ink">
                Age <span className="font-normal text-brand-ink/40">(optional)</span>
              </label>
              <input
                id="patient-age"
                type="number"
                min={0}
                max={120}
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
              />
            </div>
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-medium text-brand-ink">Home Visit Required?</legend>
            <div className="flex gap-3">
              {[
                { label: "No", value: false },
                { label: "Yes", value: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => update("homeVisit", option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.homeVisit === option.value
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-brand-sky/40 text-brand-ink hover:border-brand-blue/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="patient-message" className="mb-1 block text-sm font-medium text-brand-ink">
              Short Message / Reason for Appointment <span className="font-normal text-brand-ink/40">(optional)</span>
            </label>
            <textarea
              id="patient-message"
              rows={3}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full rounded-lg border border-brand-sky/50 px-3 py-3 text-base focus:border-brand-blue"
            />
          </div>

          {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
        </div>
      )}

      {stepError && <p className="mt-4 text-sm text-rose-600">{stepError}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1}>
          Back
        </Button>
        {step < STEPS.length ? (
          <Button type="button" onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Appointment Request"}
          </Button>
        )}
      </div>
    </Card>
  );
}
