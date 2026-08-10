import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number) return null;

  const message = encodeURIComponent(
    "Hello, I would like to enquire about an appointment at Princy Hear and Speech Rehab.",
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:flex"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
