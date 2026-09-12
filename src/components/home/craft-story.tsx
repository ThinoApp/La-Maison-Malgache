import Image from "next/image";
import Link from "next/link";

export function CraftStory() {
  return (
    <section className="bg-[var(--cobalt)] text-[var(--on-cobalt)]">
      <div className="site-shell grid min-h-[78svh] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[48svh] overflow-hidden lg:min-h-full">
          <Image
            src="/assets/generated/craft.webp"
            alt="Geste de tressage illustrant l'univers des savoir-faire"
            fill
            unoptimized
            sizes="(max-width: 1023px) 100vw, 54vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--cobalt)]/18 mix-blend-color" />
        </div>

        <div className="flex flex-col justify-between border-t border-white/25 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14 xl:p-16">
          <h2 className="display max-w-2xl text-balance text-[clamp(3rem,5.5vw,5.6rem)] leading-[0.9]">
            La matière garde la mémoire du geste.
          </h2>
          <div className="mt-14 max-w-xl">
            <p className="text-base leading-7 text-[color-mix(in_srgb,var(--on-cobalt)_82%,transparent)] sm:text-lg sm:leading-8">
              Bois, fibres, terre, textile. Derrière une matière se trouvent des techniques, des usages et des connaissances qui donnent à chaque objet sa singularité.
            </p>
            <Link href="/savoir-faire" className="link-underline mt-8 text-sm font-medium">
              Explorer les savoir-faire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
