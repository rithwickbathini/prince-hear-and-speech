import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ButtonLink } from "./Button";
import logoMark from "../assets/logo/princy-logo-mark.jpg";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/therapists", label: "Therapists" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock background scroll while the mobile menu is open, and allow Escape to close it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-sky/30 bg-white/90 backdrop-blur">
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6" aria-label="Primary">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logoMark} alt="" className="h-9 w-9 flex-none rounded-full object-cover" />
          <span className="min-w-0 text-base font-bold leading-tight text-brand-blue-dark">
            Princy
            <span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-brand-blue/70">
              Hear &amp; Speech Rehab
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
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

        <div className="hidden lg:block">
          <ButtonLink to="/book-appointment">Book Your Consultation</ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 flex-none items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-sky-light lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Backdrop — sits below nav (z-10) but above page content, so the header bar stays undimmed */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-0 bg-brand-ink/30 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-nav-menu"
        className={`absolute left-0 right-0 top-full z-0 origin-top border-t border-brand-sky/30 bg-white shadow-lg transition-all duration-200 lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-base font-medium ${
                  isActive ? "bg-brand-sky-light text-brand-blue" : "text-brand-ink/80 hover:bg-brand-sky-light/60"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <ButtonLink to="/book-appointment" className="mt-2 justify-center" onClick={() => setOpen(false)}>
            Book Your Consultation
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
