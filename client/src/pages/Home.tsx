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
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { ServiceCard } from "../components/ServiceCard";
import { Slideshow } from "../components/Slideshow";
import { WaveDivider } from "../components/WaveDivider";
import heroIllustration from "../assets/photos/hero-illustration.jpg";
import speechTherapyWatermark from "../assets/watermarks/speech-therapy.jpg";
import audiologyWatermark from "../assets/watermarks/audiology.jpg";
import strokeRehabWatermark from "../assets/watermarks/stroke-rehab.jpg";
import homeBasedSlide1 from "../assets/photos/home-based/slide-1.jpg";
import homeBasedSlide2 from "../assets/photos/home-based/slide-2.jpg";
import homeBasedSlide3 from "../assets/photos/home-based/slide-3.jpg";

const HOME_BASED_SLIDES = [
  { src: homeBasedSlide1, alt: "Therapist communicating with a patient using sign language during a home therapy session" },
  { src: homeBasedSlide2, alt: "Two people signing and communicating together during a home speech therapy session" },
  { src: homeBasedSlide3, alt: "A home-based therapist helping an elderly patient with a hand exercise ball" },
];

const SERVICE_PILLARS = [
  {
    icon: <MessagesSquare size={22} />,
    title: "Speech Therapy",
    description: "One-on-one therapy for speech delay, articulation, stammering, and voice disorders — for children and adults.",
    bullets: ["Pediatric speech-language therapy", "Stammering & fluency support", "Voice & articulation therapy"],
    to: "/services#speech-therapy",
    watermark: speechTherapyWatermark,
  },
  {
    icon: <Ear size={22} />,
    title: "Audiology",
    description: "Complete hearing assessments and hearing aid guidance using standard diagnostic testing.",
    bullets: ["Pure tone & speech audiometry", "Tympanometry & OAE testing", "Hearing aid consultation"],
    to: "/services#audiology",
    watermark: audiologyWatermark,
  },
  {
    icon: <HeartPulse size={22} />,
    title: "Stroke Rehabilitation",
    description: "Structured recovery support for communication and swallowing difficulties following a stroke.",
    bullets: ["Aphasia & apraxia rehabilitation", "Cognitive-communication therapy", "Swallowing (dysphagia) support"],
    to: "/services#stroke-rehabilitation",
    watermark: strokeRehabWatermark,
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
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-blue">
              Princy Hear and Speech Rehab
            </p>
            <h1 className="text-[28px] font-bold text-balance leading-tight text-brand-ink sm:text-4xl md:text-5xl">
              Hear the World. Find Your Voice. Create Your Connection.
            </h1>
            <p className="mt-4 text-base font-semibold text-brand-blue-dark sm:mt-5 sm:text-lg">
              Empowering communication at every stage of life.
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-ink/70 sm:text-base">
              Professional <strong className="font-semibold text-brand-ink">Speech Therapy, Audiology, and Stroke
              Rehabilitation</strong> services for children and adults, with personalized care designed around
              every individual&apos;s needs.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <ButtonLink to="/book-appointment" size="lg" className="w-full justify-center sm:w-auto">
                Book Your Consultation
              </ButtonLink>
              <ButtonLink to="/services" variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                Explore Our Services
              </ButtonLink>
            </div>
          </div>
          <img
            src={heroIllustration}
            alt="Illustration of a therapist having a supportive conversation with a patient"
            className="aspect-square w-full max-w-md rounded-3xl object-cover shadow-md md:mx-auto"
          />
        </div>
      </section>

      <WaveDivider fill="#EAF6FC" />

      {/* Trust / Introduction */}
      <section className="bg-brand-sky-light py-12 sm:py-16 md:py-20">
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
      <section className="bg-white py-12 sm:py-16 md:py-20">
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
      <section className="bg-brand-blue-dark py-12 text-white sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-sky">Care That Comes to You</p>
            <h2 className="text-2xl font-bold text-balance sm:text-3xl md:text-4xl">We also provide Home-Based Therapy</h2>
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
          <Slideshow
            slides={HOME_BASED_SLIDES}
            className="aspect-[4/3] w-full rounded-3xl shadow-md"
          />
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
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
      <section className="bg-brand-sky-light py-12 text-center sm:py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-balance text-brand-ink sm:text-3xl md:text-4xl">Ready to Take the Next Step?</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink/70">
            Book an appointment with our team and let us help you or your loved ones move toward better
            communication, hearing and recovery.
          </p>
          <p className="mt-6 text-sm font-medium italic text-brand-blue-dark">
            Your journey toward better communication, hearing, and recovery starts here.
          </p>
          <div className="mt-8">
            <ButtonLink to="/book-appointment" size="lg">Book Your Consultation</ButtonLink>
          </div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Get in touch" title="Visit or contact the clinic" className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Princy+Hear+and+Speech+Rehab%2C+Meena+Bhawan%2C+285-AB%2C+Nandan+Vihar%2C+Patia%2C+Bhubaneswar%2C+Odisha+751024"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full p-5 transition-colors hover:border-brand-blue">
                <MapPin size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                <p className="text-sm font-semibold text-brand-ink">Location</p>
                <p className="mt-1 text-sm text-brand-ink/70">
                  Meena Bhawan, 285-AB, Near MedPlus Lane and Hanuman Mandir, Nandan Vihar, Patia, Bhubaneswar – 751024
                </p>
              </Card>
            </a>
            <Card className="p-5">
              <Phone size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Phone</p>
              <p className="mt-1 text-sm text-brand-ink/70">
                <a href="tel:+918249964216" className="inline-block py-1 hover:text-brand-blue">8249964216</a>
                {" · "}
                <a href="tel:+918984548004" className="inline-block py-1 hover:text-brand-blue">8984548004</a>
              </p>
            </Card>
            <Card className="p-5">
              <Mail size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Email</p>
              <p className="mt-1 text-sm text-brand-ink/70">
                <a
                  href="mailto:princyhearandspeechrehab@gmail.com"
                  className="inline-block break-all py-1 hover:text-brand-blue"
                >
                  princyhearandspeechrehab@gmail.com
                </a>
              </p>
            </Card>
            <Card className="p-5">
              <ShieldCheck size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
              <p className="text-sm font-semibold text-brand-ink">Working Hours</p>
              <p className="mt-1 text-sm text-brand-ink/70">Mon – Sat, 9:00 AM – 7:00 PM (IST)</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
