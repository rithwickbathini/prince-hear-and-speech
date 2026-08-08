import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-brand-sky/40 bg-white shadow-sm ${className}`} {...props} />;
}
