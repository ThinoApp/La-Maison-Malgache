import Image from "next/image";
import Link from "next/link";

export function PlaceStory() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)]">
      <div className="site-shell section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative min-h-[34rem] overflow-hidden lg:col-span-7 lg:min-h-[44rem]">
            <Image
              src="/assets/generated/place.webp"
              alt="Paysage et intérieur évoquant le territoire de Madagascar"
              fill
              unoptimized
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="object-cover"
            />
          </div>

          <div className="relative lg:col-span-5 lg:pl-8">
            <Image
              src="/assets/images/madagascar.svg"
              alt="Carte de Madagascar"
              width={155}
              height={299}
              className="mb-10 h-44 w-auto opacity-55 dark:invert sm:h-52"
            />
            <h2 className="display max-w-2xl text-balance text-4xl leading-[0.94] sm:text-6xl">
              Madagascar n'est pas le décor de la Maison. C'est son point de départ.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              Les matières, les techniques et les objets prennent sens dans des lieux. La Maison Malgache veut rendre ces liens visibles et permettre de passer d'une pièce à son territoire, puis du territoire à d'autres histoires.
            </p>
            <Link href="/la-maison" className="link-underline mt-8 text-sm font-medium">
              Découvrir notre histoire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
