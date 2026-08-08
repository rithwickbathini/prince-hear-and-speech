import { Ear, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ButtonLink } from "./Button";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/therapists", label: "Therapists" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-sky/30 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white">
            <Ear size={18} aria-hidden="true" />
          </span>
          <span className="text-base font-bold leading-tight text-brand-blue-dark">
            Princy
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-brand-blue/70">
              Hear &amp; Speech Rehab
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-brand-blue" : "text-brand-ink/70 hover:text-brand-blue"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <ButtonLink to="/book-appointment">Book Appointment</ButtonLink>
        </div>

        <button
          type="button"
          className="text-brand-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand-sky/30 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `text-sm font-medium ${isActive ? "text-brand-blue" : "text-brand-ink/70"}`}
              >
                {link.label}
              </NavLink>
            ))}
            <ButtonLink to="/book-appointment" className="justify-center" onClick={() => setOpen(false)}>
              Book Appointment
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
