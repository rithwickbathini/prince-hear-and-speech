import { AppointmentForm } from "../components/AppointmentForm";
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";

export default function BookAppointment() {
  return (
    <>
      <Seo
        title="Book Your Consultation"
        description="Book a speech therapy, audiology or stroke rehabilitation appointment at Princy Hear and Speech Rehab — no account required."
      />
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Book Your Consultation"
            title="Let's get you scheduled"
            description="No account needed — just a few quick details and we'll take it from there."
            className="mx-auto mb-10"
          />
          <AppointmentForm />
        </div>
      </section>
    </>
  );
}
