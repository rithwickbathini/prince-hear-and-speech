import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "./Card";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  bullets?: string[];
  to: string;
  /** Optional faint background photo, purely decorative (e.g. a themed watermark). */
  watermark?: string;
}

export function ServiceCard({ icon, title, description, bullets, to, watermark }: Props) {
  return (
    <Card className="relative flex h-full flex-col gap-4 overflow-hidden p-6">
      {watermark && (
        <img
          src={watermark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.07]"
        />
      )}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-sky-light text-brand-blue">
        {icon}
      </div>
      <h3 className="relative text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="relative text-sm leading-relaxed text-brand-ink/70">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="relative space-y-1.5 text-sm text-brand-ink/70">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-pink" />
              {bullet}
            </li>
          ))}
        </ul>
      )}
      <Link
        to={to}
        className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
      >
        Learn more <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </Card>
  );
}
