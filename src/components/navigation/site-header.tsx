"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/boutique", label: "Boutique" },
  { href: "/collections/premiere-selection", label: "Collections" },
  { href: "/savoir-faire", label: "Savoir-faire" },
  { href: "/la-maison", label: "La Maison" },
  { href: "/journal", label: "Journal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const borderClass = isHome ? "border-white/25" : "border-[var(--line)]";

  return (
    <header
      className={`${isHome ? "absolute inset-x-0 top-0 text-white" : "relative bg-[var(--background)] text-[var(--ink)]"} z-50 border-b ${borderClass}`}
    >
      <div className="site-shell grid min-h-20 grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[minmax(15rem,1fr)_auto_minmax(15rem,1fr)]">
        <Link href="/" className="display w-fit text-[1.45rem] leading-none sm:text-[1.65rem]">
          La Maison Malgache
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-5 text-sm">
          <Link href="/contact" className="link-underline hidden sm:inline-flex">
            Contact
          </Link>
          <Link href="/panier" className="link-underline">
            Panier
          </Link>
        </div>
      </div>

      <nav aria-label="Navigation mobile" className={`site-shell overflow-x-auto border-t ${borderClass} lg:hidden`}>
        <ul className="flex min-w-max items-center gap-6 py-3 text-sm">
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link-underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
