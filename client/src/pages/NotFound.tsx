import { Ear } from "lucide-react";
import { ButtonLink } from "../components/Button";
import { Seo } from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-sky-light text-brand-blue">
          <Ear size={28} aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-bold text-brand-ink">Page not found</h1>
        <p className="max-w-sm text-sm text-brand-ink/60">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <ButtonLink to="/" className="mt-2">Back to Home</ButtonLink>
      </div>
    </>
  );
}
