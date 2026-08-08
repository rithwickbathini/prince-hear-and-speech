import { Facebook, Instagram, Linkedin, User } from "lucide-react";
import type { Therapist } from "../types";
import { Card } from "./Card";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  return (
    <Card className="overflow-hidden">
      <ImagePlaceholder
        label={`Photo of ${therapist.name}`}
        icon={<User size={32} aria-hidden="true" />}
        className="aspect-[4/3] w-full"
      />
      <div className="space-y-2 p-5">
        <h3 className="text-base font-semibold text-brand-ink">{therapist.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{therapist.specialization}</p>
        <p className="text-xs text-brand-ink/60">{therapist.qualification}</p>
        <p className="text-sm leading-relaxed text-brand-ink/70">{therapist.bio}</p>
        <div className="flex gap-3 pt-2 text-brand-ink/30" aria-hidden="true">
          <Facebook size={16} />
          <Instagram size={16} />
          <Linkedin size={16} />
        </div>
      </div>
    </Card>
  );
}
