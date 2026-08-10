import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { TherapistCard } from "../components/TherapistCard";
import { useTherapists } from "../hooks/useTherapists";

export default function Therapists() {
  const { therapists, loading, error } = useTherapists();

  return (
    <>
      <Seo
        title="Our Therapists"
        description="Meet the therapists and audiologists at Princy Hear and Speech Rehab."
      />

      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our team"
            title="Meet the Team"
            description="Full therapist profiles — qualifications, specializations and photos — will be added as the clinic provides them. The structure below is ready for that content."
          />

          <div className="mt-12">
            {loading && <p className="text-sm text-brand-ink/60">Loading team…</p>}
            {error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
            {!loading && !error && therapists.length === 0 && (
              <p className="rounded-xl border border-dashed border-brand-sky/60 bg-white p-10 text-center text-sm text-brand-ink/60">
                Therapist profiles will appear here once they&apos;re added.
              </p>
            )}
            {!loading && !error && therapists.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {therapists.map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
