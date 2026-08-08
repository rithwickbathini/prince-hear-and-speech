import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sets per-page title + meta description + Open Graph tags. No page router dependency needed. */
export function Seo({ title, description }: Props) {
  useEffect(() => {
    const fullTitle = `${title} | Princy Hear and Speech Rehab`;
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
  }, [title, description]);

  return null;
}
