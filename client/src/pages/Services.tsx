import { Ear, HeartPulse, Home as HomeIcon, type LucideIcon, MessagesSquare } from "lucide-react";
import { ButtonLink } from "../components/Button";
import { Card } from "../components/Card";
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { useServices } from "../hooks/useServices";
import { SERVICE_CATEGORY_LABELS, type ServiceCategory } from "../types";

const CATEGORY_META: Record<ServiceCategory, { icon: LucideIcon; description: string; anchor: string }> = {
  SPEECH_THERAPY: {
    icon: MessagesSquare,
    description: "Individualized therapy for speech, language, fluency and voice.",
    anchor: "speech-therapy",
  },
  AUDIOLOGY: {
    icon: Ear,
    description: "Diagnostic hearing tests and hearing aid guidance.",
    anchor: "audiology",
  },
  STROKE_REHAB: {
    icon: HeartPulse,
    description: "Communication and swallowing recovery support after a stroke.",
    anchor: "stroke-rehabilitation",
  },
  HOME_BASED: {
    icon: HomeIcon,
    description: "The same quality of care, delivered at home.",
    anchor: "home-based",
  },
};

const CATEGORY_ORDER: ServiceCategory[] = ["SPEECH_THERAPY", "AUDIOLOGY", "STROKE_REHAB", "HOME_BASED"];

export default function Services() {
  const { services, loading, error } = useServices();

  return (
    <>
      <Seo
        title="Services"
        description="Speech therapy, audiology, stroke rehabilitation and home-based therapy services at Princy Hear and Speech Rehab."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we offer"
            title="Our Services"
            description="A closer look at each program, grouped by area of care."
          />
        </div>
      </section>

      {loading && (
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <p className="text-sm text-brand-ink/60">Loading services…</p>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        CATEGORY_ORDER.map((category, index) => {
          const items = services.filter((service) => service.category === category);
          if (items.length === 0) return null;
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;

          return (
            <section
              key={category}
              id={meta.anchor}
              className={`scroll-mt-20 py-16 sm:py-20 ${index % 2 === 0 ? "bg-white" : "bg-brand-sky-light"}`}
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-blue text-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-brand-ink">{SERVICE_CATEGORY_LABELS[category]}</h2>
                    <p className="text-sm text-brand-ink/60">{meta.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((service) => (
                    <Card key={service.id} className="p-5">
                      <h3 className="text-sm font-semibold text-brand-ink">{service.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/70">{service.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

      {!loading && !error && services.length === 0 && (
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm text-brand-ink/60">Services will appear here once they&apos;re added by the clinic.</p>
        </div>
      )}

      <section className="bg-brand-blue-dark py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Not sure which service is right for you?</h2>
          <p className="mt-3 text-sm text-white/75">
            Book an appointment and our team will help guide you to the right program.
          </p>
          <div className="mt-6">
            <ButtonLink to="/book-appointment" size="lg">Book an Appointment</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
