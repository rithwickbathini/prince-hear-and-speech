interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className = "" }: Props) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-blue">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-balance text-brand-ink sm:text-3xl md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-brand-ink/70 sm:text-base">{description}</p>
      )}
    </div>
  );
}
