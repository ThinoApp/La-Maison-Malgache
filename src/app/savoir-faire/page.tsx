import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title: "Savoir-faire" };
export default function SavoirFairePage() {
  return <div className="site-shell py-16 sm:py-24"><header className="max-w-5xl"><h1 className="display text-balance text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">Les gestes doivent pouvoir se découvrir comme les objets.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">Cette route accueillera les matières, techniques, ateliers et contenus de transmission reliés au catalogue.</p></header><div className="mt-16 grid gap-8 border-t border-[var(--line)] pt-8 lg:grid-cols-[1.25fr_0.75fr]"><div className="relative min-h-[60svh] overflow-hidden bg-[var(--surface)]"><Image src="/assets/images/Cta-bg.png" alt="Matière artisanale" fill sizes="(max-width: 1023px) 100vw, 62vw" className="object-cover" /></div><div className="flex items-end"><p className="max-w-md text-2xl leading-9 text-[var(--muted)]">Les données éditoriales définitives devront provenir d'entretiens, fiches atelier ou sources validées.</p></div></div></div>;
}
