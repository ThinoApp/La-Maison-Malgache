import Image from "next/image";
import Link from "next/link";

const entries = [
  {
    title: "Les matières",
    copy: "Comprendre ce que la matière change dans la lecture d'un objet.",
    image: "/assets/images/CDC_1.png",
  },
  {
    title: "Les gestes",
    copy: "Observer ce que la main transmet quand une matière devient une pièce.",
    image: "/assets/images/Cta-bg.png",
  },
  {
    title: "Les territoires",
    copy: "Regarder Madagascar à travers les objets, les usages et les histoires.",
    image: "/assets/images/hero_1.png",
  },
];

export function JournalPreview() {
  return (
    <section className="site-shell section-pad">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end sm:mb-14">
        <div>
          <h2 className="display text-5xl leading-[0.94] sm:text-7xl">Continuer le voyage.</h2>
          <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">
            Le Journal prolonge la découverte par les matières, les gestes, les lieux et les histoires qui entourent les objets.
          </p>
        </div>
        <Link href="/journal" className="link-underline w-fit text-sm font-medium">
          Lire le Journal
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-3 md:gap-5">
        {entries.map((entry) => (
          <Link key={entry.title} href="/journal" className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
              <Image
                src={entry.image}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </div>
            <div className="border-b border-[var(--line)] py-5">
              <h3 className="display text-3xl">{entry.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{entry.copy}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
