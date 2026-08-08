import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionHeading } from "../components/SectionHeading";
import { Seo } from "../components/Seo";
import { contactApi } from "../services/contact";
import { ApiError } from "../services/api";
import { isValidEmail } from "../utils/validators";

const mapsUrl = import.meta.env.VITE_GOOGLE_MAPS_URL;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !message.trim()) {
      setFormError("Please share your name and a short message.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setFormError("Please provide an email or phone number so we can reach you.");
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      await contactApi.submit({ name, email: email || undefined, phone: phone || undefined, message });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    }
  }

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with Princy Hear and Speech Rehab — location, phone, hours and a contact form." />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Get in touch" title="Contact Us" description="We're happy to answer questions before you book — reach out any way that works for you." />

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <MapPin size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-ink">Address</p>
                  <p className="mt-1 text-sm text-brand-ink/70">[Clinic Address]</p>
                </Card>
                <Card className="p-5">
                  <Phone size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-ink">Phone</p>
                  <p className="mt-1 text-sm text-brand-ink/70">[Phone Number]</p>
                </Card>
                <Card className="p-5">
                  <MessageCircle size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-ink">WhatsApp</p>
                  <p className="mt-1 text-sm text-brand-ink/70">[WhatsApp Number]</p>
                </Card>
                <Card className="p-5">
                  <Mail size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-ink">Email</p>
                  <p className="mt-1 text-sm text-brand-ink/70">[Email Address]</p>
                </Card>
                <Card className="p-5 sm:col-span-2">
                  <Clock size={20} className="mb-2 text-brand-blue" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-ink">Working Hours</p>
                  <p className="mt-1 text-sm text-brand-ink/70">[Working Hours]</p>
                </Card>
              </div>

              <Card className="overflow-hidden">
                {mapsUrl ? (
                  <iframe
                    title="Clinic location"
                    src={mapsUrl}
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-56 flex-col items-center justify-center gap-2 bg-brand-sky-light text-center">
                    <MapPin size={28} className="text-brand-blue/50" aria-hidden="true" />
                    <p className="px-6 text-xs font-medium text-brand-blue/60">
                      Map will appear here once VITE_GOOGLE_MAPS_URL is configured.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-brand-ink">Send us a message</h2>
              {status === "success" ? (
                <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Thank you — your message has been sent. We&apos;ll get back to you soon.
                </p>
              ) : (
                <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-brand-ink">Name</label>
                    <input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-brand-ink">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-brand-ink">Phone</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-brand-ink">Message</label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-brand-sky/50 px-3 py-2.5 text-sm focus:border-brand-blue"
                      required
                    />
                  </div>
                  {formError && <p className="text-sm text-rose-600">{formError}</p>}
                  <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
                    {status === "submitting" ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
