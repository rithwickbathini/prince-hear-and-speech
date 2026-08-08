import { ButtonHTMLAttributes, forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
  secondary: "border border-brand-blue text-brand-blue hover:bg-brand-sky-light",
  ghost: "text-brand-blue hover:bg-brand-sky-light",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = ""): string {
  return `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & ButtonOwnProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonOwnProps & LinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
