import { Ear, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Ear size={18} aria-hidden="true" />
            </span>
            <span className="text-base font-bold">Princy Hear and Speech Rehab</span>
          </Link>
          <p className="text-sm text-white/70">Empowering communication at every stage of life.</p>
          <div className="flex gap-3 pt-1 text-white/60" aria-hidden="true">
            <Facebook size={16} />
            <Instagram size={16} />
            <Linkedin size={16} />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Navigate</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/therapists" className="hover:text-white">Therapists</Link></li>
            <li><Link to="/book-appointment" className="hover:text-white">Book Appointment</Link></li>
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
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 flex-none" aria-hidden="true" />[Clinic Address]</li>
            <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 flex-none" aria-hidden="true" />[Phone Number]</li>
            <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 flex-none" aria-hidden="true" />[Email Address]</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Princy Hear and Speech Rehab. All rights reserved.
      </div>
    </footer>
  );
}
