import type { ReactNode } from "react";

interface Props {
  label: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Stands in for real clinic photography so the layout never breaks or looks fake.
 * Swap for a real <img alt={label} .../> once the clinic supplies photos.
 */
export function ImagePlaceholder({ label, icon, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-sky-light via-white to-brand-pink/15 text-center ${className}`}
    >
      {icon && <div className="text-brand-blue/40">{icon}</div>}
      <p className="px-4 text-xs font-medium text-brand-blue/60">{label}</p>
    </div>
  );
}
