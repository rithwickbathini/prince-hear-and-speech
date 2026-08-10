import { useEffect, useState } from "react";

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  className?: string;
  intervalMs?: number;
}

/** Simple auto-advancing crossfade slideshow. No external libraries — plain CSS transitions + state. */
export function Slideshow({ slides, className = "", intervalMs = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      reduceMotion ? intervalMs * 2.5 : intervalMs,
    );
    return () => clearInterval(id);
  }, [slides.length, paused, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}`}
              aria-current={i === index}
              className="p-3"
            >
              <span
                className={`block h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
