import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logoMark from "../assets/logo/princy-logo-mark.jpg";

export function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 text-white">
            <img src={logoMark} alt="" className="h-9 w-9 flex-none rounded-full object-cover ring-1 ring-white/30" />
            <span className="text-base font-bold">Princy Hear and Speech Rehab</span>
          </Link>
          <p className="text-sm text-white/70">Empowering communication at every stage of life.</p>
          <div className="-ml-2 flex items-center gap-1 pt-1 text-white/60">
            <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">
              <Facebook size={16} />
            </span>
            <a
              href="https://www.instagram.com/princy_hear_and_speech?igsh=MXR0d2tmbTVwaHUwNA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Princy Hear and Speech Rehab on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
            >
              <Instagram size={16} />
            </a>
            <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">
              <Linkedin size={16} />
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Navigate</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/therapists" className="hover:text-white">Therapists</Link></li>
            <li><Link to="/book-appointment" className="hover:text-white">Book Your Consultation</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Speech Therapy</li>
            <li>Audiology</li>
            <li>Stroke Rehabilitation</li>
            <li>Home-Based Therapy</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex min-w-0 items-start gap-2">
              <MapPin size={15} className="mt-0.5 flex-none" aria-hidden="true" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Princy+Hear+and+Speech+Rehab%2C+Meena+Bhawan%2C+285-AB%2C+Nandan+Vihar%2C+Patia%2C+Bhubaneswar%2C+Odisha+751024"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1 hover:text-white"
              >
                Meena Bhawan, 285-AB, Near MedPlus Lane and Hanuman Mandir, Nandan Vihar, Patia, Bhubaneswar – 751024
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-1 flex-none" aria-hidden="true" />
              <span>
                <a href="tel:+918249964216" className="inline-block py-1.5 hover:text-white">8249964216</a>
                {" · "}
                <a href="tel:+918984548004" className="inline-block py-1.5 hover:text-white">8984548004</a>
              </span>
            </li>
            <li className="flex min-w-0 items-start gap-2">
              <Mail size={15} className="mt-1 flex-none" aria-hidden="true" />
              <a
                href="mailto:princyhearandspeechrehab@gmail.com"
                className="inline-block break-all py-1.5 hover:text-white"
              >
                princyhearandspeechrehab@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 border-t border-white/10 px-4 py-5 text-center text-xs text-white/50 sm:flex-row">
        <span>© {new Date().getFullYear()} Princy Hear and Speech Rehab. All rights reserved.</span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <Link to="/admin/login" className="hover:text-white">Admin Login</Link>
      </div>
    </footer>
  );
}
