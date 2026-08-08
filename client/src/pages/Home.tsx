import {
  Baby,
  ClipboardList,
  Ear,
  Heart,
  HeartPulse,
  Home as HomeIcon,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { ButtonLink } from "../components/Button";
import { Card } from "../components/Card";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { ServiceCard } from "../components/ServiceCard";
import { WaveDivider } from "../components/WaveDivider";

const SERVICE_PILLARS = [
  {
    icon: <MessagesSquare size={22} />,
    title: "Speech Therapy",
    description: "One-on-one therapy for speech delay, articulation, stammering, and voice disorders — for children and adults.",
    bullets: ["Pediatric speech-language therapy", "Stammering & fluency support", "Voice & articulation therapy"],
    to: "/services#speech-therapy",
  },
  {
    icon: <Ear size={22} />,
    title: "Audiology",
    description: "Complete hearing assessments and hearing aid guidance using standard diagnostic testing.",
    bullets: ["Pure tone & speech audiometry", "Tympanometry & OAE testing", "Hearing aid consultation"],
    to: "/services#audiology",
  },
  {
    icon: <HeartPulse size={22} />,
    title: "Stroke Rehabilitation",
    description: "Structured recovery support for communication and swallowing difficulties following a stroke.",
    bullets: ["Aphasia & apraxia rehabilitation", "Cognitive-communication therapy", "Swallowing (dysphagia) support"],
    to: "/services#stroke-rehabilitation",
  },
];

const WHY_CHOOSE_US = [
  { icon: ClipboardList, title: "Personalized Therapy Plans", description: "Every plan is built around the individual, not a one-size-fits-all program." },
  { icon: ShieldCheck, title: "Professional Care", description: "Structured, evidence-based therapy delivered with consistency and care." },
  { icon: Baby, title: "Child-Friendly Approach", description: "Sessions designed to keep young patients comfortable and engaged." },
  { icon: Users2, title: "Comprehensive Assessment", description: "A thorough evaluation before every therapy plan is put together." },
  { icon: HomeIcon, title: "Home-Based Therapy", description: "Care delivered where your family is most comfortable, when clinic visits aren't practical." },
  { icon: Heart, title: "Patient-Centered Care", description: "Your goals and pace guide every session, from the first visit onward." },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Speech Therapy, Audiology & Stroke Rehabilitation"
        description="Professional speech therapy, audiology and stroke rehabilitation services for children and adults at Princy Hear and Speech Rehab, including home-based therapy."
      />

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-blue">
              Princy Hear and Speech Rehab
            </p>
            <h1 className="text-4xl font-bold text-balance leading-tight text-brand-ink sm:text-5xl">
              Hear the World. Find Your Voice. Create Your Connection.
            </h1>
            <p className="mt-5 text-lg font-semibold text-brand-blue-dark">
              Empowering communication at every stage of life.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-ink/70">
              Professional <strong className="font-semibold text-brand-ink">Speech Therapy, Audiology, and Stroke
              Rehabilitation</strong> services for children and adults, with personalized care designed around
              every individual&apos;s needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to="/book-appointment" size="lg">Book an Appointment</ButtonLink>
              <ButtonLink to="/services" variant="secondary" size="lg">Explore Our Services</ButtonLink>
            </div>
          </div>
          <ImagePlaceholder
            label="Photo of a therapist working with a patient at Princy Hear and Speech Rehab"
            icon={<HeartPulse size={40} aria-hidden="true" />}
            className="aspect-[4/3] w-full rounded-3xl"
          />
        </div>
      </section>

      <WaveDivider fill="#EAF6FC" />

      {/* Trust / Introduction */}
      <section className="bg-brand-sky-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Who we are"
            title="Princy Hear and Speech Rehab"
            description="We provide professional speech, hearing and rehabilitation services for children and adults, guided by careful assessment and a genuinely patient-first approach. Whether it's a first speech delay concern, a hearing evaluation, or recovery after a stroke, our team works with you to build a plan that fits your life."
          />
        </div>
      </section>

      <WaveDivider fill="#FFFFFF" flip />

      {/* Services overview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="What we offer"
            title="Our Core Services"
            description="Three areas of care, each led by structured assessment and an individualized therapy plan."
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PILLARS.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Home-based therapy highlight */}
      <section className="bg-brand-blue-dark py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-sky">Care That Comes to You</p>
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">We also provide Home-Based Therapy</h2>
            <ul className="mt-6 space-y-3 text-white/85">
              <li className="flex items-start gap-3">
                <HomeIcon size={18} className="mt-1 flex-none text-brand-sky" aria-hidden="true" />
                Home Speech Therapy
              </li>
              <li className="flex items-start gap-3">
                <Baby size={18} className="mt-1 flex-none text-brand-sky" aria-hidden="true" />
                Pediatric Home Therapy
              </li>
              <li className="flex items-start gap-3">
                <HeartPulse size={18} className="mt-1 flex-none text-brand-sky" aria-hidden="true" />
                Stroke Rehabilitation at Home
              </li>
            </ul>
            <div className="mt-8">
              <ButtonLink to="/book-appointment" size="lg">Book Home-Based Therapy</ButtonLink>
            </div>
          </div>
          <ImagePlaceholder
            label="Photo of a home-based therapy session"
            icon={<HomeIcon size={40} aria-hidden="true" />}
            className="aspect-[4/3] w-full rounded-3xl bg-white/10 from-transparent via-transparent to-transparent"
          />
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading align="center" eyebrow="Why choose us" title="Care built around you" className="mx-auto" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6">
                <Icon size={24} className="mb-3 text-brand-blue" aria-hidden="true" />
                <h3 className="text-base font-semibold text-brand-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/70">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill="#EAF6FC" />

      {/* Appointment CTA */}
      <section className="bg-brand-sky-light py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-balance text-brand-ink sm:text-4xl">Ready to Take the Next Step?</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink/70">
            Book an appointment with our team and let us help you or your loved ones move toward better
            communication, hearing and recovery.
          </p>
          <p className="mt-6 text-sm font-medium italic text-brand-blue-dark">
            Your journey toward better communication, hearing, and recovery starts here.
          </p>
          <div className="mt-8">
            <ButtonLink to="/book-appointment" size="lg">Book an Appointment</ButtonLink>
          </div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Get in touch" title="Visit or contact the clinic" className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <MapPin size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Location</p>
              <p className="mt-1 text-sm text-brand-ink/70">[Clinic Address]</p>
            </Card>
            <Card className="p-5">
              <Phone size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Phone</p>
              <p className="mt-1 text-sm text-brand-ink/70">[Phone Number]</p>
            </Card>
            <Card className="p-5">
              <Mail size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Email</p>
              <p className="mt-1 text-sm text-brand-ink/70">[Email Address]</p>
            </Card>
            <Card className="p-5">
              <ShieldCheck size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Working Hours</p>
              <p className="mt-1 text-sm text-brand-ink/70">[Working Hours]</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
