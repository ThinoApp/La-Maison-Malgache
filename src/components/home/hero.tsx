import Link from "next/link";
import { HeroMedia } from "@/components/motion/hero-media";

const threads = ["Objet", "Matière", "Geste", "Territoire"];

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-[#111615] text-white">
      <HeroMedia />
      <div className="site-shell relative z-10 flex min-h-[100dvh] flex-col justify-end pb-12 pt-40 sm:pb-16 md:pb-20 lg:pt-44">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.55fr)] lg:gap-20">
          <div className="max-w-[54rem]">
            <h1 className="display text-balance text-[clamp(3.7rem,8vw,6rem)] leading-[0.88]">
              Madagascar chez vous, autrement.
            </h1>
            <p className="mt-7 max-w-[38rem] text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
              La Maison Malgache réunit des objets, des matières et des savoir-faire de Madagascar dans une maison pensée pour les découvrir autrement.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/boutique"
                className="pressable inline-flex min-h-12 items-center bg-white px-6 py-3 text-sm font-medium text-[#151918] transition-colors duration-300 hover:bg-white/90"
              >
                Découvrir la boutique
              </Link>
              <Link href="/savoir-faire" className="link-underline text-sm font-medium text-white">
                Explorer les savoir-faire
              </Link>
            </div>
          </div>

          <div className="hidden border-t border-white/35 pt-5 lg:block">
            <p className="max-w-xs text-sm leading-6 text-white/70">
              Une même histoire se lit à travers quatre fils.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-0">
              {threads.map((thread) => (
                <p key={thread} className="border-t border-white/25 py-3 text-sm">
                  {thread}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
