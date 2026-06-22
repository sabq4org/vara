"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "اليوم" },
  { href: "/competitions/732", label: "كأس العالم" },
  { href: "/competitions", label: "البطولات" },
  { href: "/live", label: "مباشر" },
];

export function NavLinks() {
  const pathname = usePathname();
  // A link matches when the path is exactly it or sits under it. The most
  // specific match wins, so /competitions/732 lights up "كأس العالم" only —
  // not the broader "البطولات" (/competitions).
  const matches = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const activeHref = LINKS.map((l) => l.href)
    .filter(matches)
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="flex items-center gap-1 overflow-x-auto text-sm">
      {LINKS.map((l) => {
        const active = l.href === activeHref;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={[
              "whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition-colors",
              active
                ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/30"
                : "text-muted hover:bg-surface2/60 hover:text-text",
            ].join(" ")}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
