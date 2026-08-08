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
}

export function ServiceCard({ icon, title, description, bullets, to }: Props) {
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-sky-light text-brand-blue">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-brand-ink/70">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5 text-sm text-brand-ink/70">
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
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
      >
        Learn more <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </Card>
  );
}
