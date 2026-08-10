import { Baby, Compass, Heart, Home as HomeIcon, Target, Users2 } from "lucide-react";
import { Card } from "../components/Card";
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { WaveDivider } from "../components/WaveDivider";
import clinicAboutPhoto from "../assets/photos/clinic-about.jpg";

const SECTIONS = [
  {
    icon: Compass,
    title: "Our Approach",
    body: "Every plan starts with a proper assessment, not a guess. From there, therapy is structured around clear, achievable goals and adjusted as progress is made — whether that's in the clinic or at home.",
  },
  {
    icon: Target,
    title: "Our Mission",
    body: "To make speech, hearing and rehabilitation care approachable and effective for every patient who walks through our doors — or welcomes us into their home.",
  },
  {
    icon: Heart,
    title: "Patient-Centered Care",
    body: "Treatment plans are built around the person, not a template. We take the time to understand each patient's routine, concerns and goals before deciding on a course of therapy.",
  },
  {
    icon: Users2,
    title: "Children & Adults",
    body: "From early speech delay in toddlers to post-stroke recovery in adults, our services are designed to meet patients wherever they are in their communication journey.",
  },
  {
    icon: HomeIcon,
    title: "Home-Based Therapy",
    body: "For patients who benefit from a familiar environment — or simply can't make it to the clinic regularly — we bring speech, pediatric and stroke rehabilitation therapy to your home.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about Princy Hear and Speech Rehab's approach to speech therapy, audiology and stroke rehabilitation for children and adults."
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-12 md:py-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-blue">About Us</p>
            <h1 className="text-[28px] font-bold text-balance text-brand-ink sm:text-4xl md:text-5xl">
              About Princy Hear and Speech Rehab
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-ink/70 sm:mt-5 sm:text-base">
              We provide professional speech therapy, audiology and stroke rehabilitation services for children and
              adults, built on careful assessment and an individualized approach to every patient we see.
            </p>
            <p className="mt-4 max-w-xl text-sm text-brand-ink/50">
              [Clinic history, credentials and specific milestones to be added by the clinic.]
            </p>
          </div>
          <img
            src={clinicAboutPhoto}
            alt="Dr. V.S. Menon, Lead Audiologist, consulting with an elderly patient and his daughter at Princy Hear and Speech Rehab"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md"
          />
        </div>
      </section>

      <WaveDivider fill="#EAF6FC" />

      <section className="bg-brand-sky-light py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading align="center" title="How we work" className="mx-auto" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="p-6">
                <Icon size={22} className="mb-3 text-brand-blue" aria-hidden="true" />
                <h2 className="text-base font-semibold text-brand-ink">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{body}</p>
              </Card>
            ))}
            <Card className="flex flex-col justify-center bg-brand-blue-dark p-6 text-white">
              <Baby size={22} className="mb-3 text-brand-sky" aria-hidden="true" />
              <h2 className="text-base font-semibold">A note on placeholders</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Therapist names, qualifications, certifications and clinic milestones will be added once provided —
                this page is structured to make that a simple content update.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
