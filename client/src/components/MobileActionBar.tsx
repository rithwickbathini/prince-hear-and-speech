import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CLINIC_PHONE = "+918249964216";
const WHATSAPP_URL =
  "https://wa.me/918249964216?text=" +
  encodeURIComponent("Hello, I would like to enquire about an appointment at Princy Hear and Speech Rehab.");

/**
 * Mobile-only sticky bottom action bar for the three highest-intent actions.
 * Hidden on the booking page itself, where the multi-step form already owns
 * the bottom of the screen with its own Back/Continue controls.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-brand-sky/40 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(20,80,122,0.08)] sm:hidden"
    >
      <a
        href={`tel:${CLINIC_PHONE}`}
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-brand-ink/80 active:bg-brand-sky-light/60"
      >
        <Phone size={20} aria-hidden="true" />
        Call
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 border-x border-brand-sky/40 py-2.5 text-xs font-medium text-brand-ink/80 active:bg-brand-sky-light/60"
      >
        <MessageCircle size={20} aria-hidden="true" />
        WhatsApp
      </a>
      <Link
        to="/book-appointment"
        className="flex flex-col items-center justify-center gap-1 bg-brand-blue py-2.5 text-xs font-semibold text-white active:bg-brand-blue-dark"
      >
        <CalendarCheck size={20} aria-hidden="true" />
        Book
      </Link>
    </nav>
  );
}
