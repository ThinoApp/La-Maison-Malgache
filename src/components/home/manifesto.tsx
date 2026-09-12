import Link from "next/link";

const pillars = [
  { title: "Objet", copy: "La pièce comme point d'entrée dans l'univers de la Maison." },
  { title: "Matière", copy: "Ce qui donne texture, usage et présence à l'objet." },
  { title: "Geste", copy: "Le savoir-faire qui transforme la matière et lui donne forme." },
  { title: "Territoire", copy: "Le contexte qui relie l'objet à Madagascar." },
];

export function Manifesto() {
  return (
    <section className="site-shell section-pad border-b border-[var(--line)]">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div className="max-w-[48rem]">
          <h2 className="display text-balance text-[clamp(3rem,5.5vw,5.6rem)] leading-[0.92]">
            Un objet prend une autre valeur quand on sait d'où il vient.
          </h2>
        </div>

        <div className="lg:pt-3">
          <p className="max-w-[42rem] text-lg leading-8">
            La Maison Malgache relie chaque pièce à ce qui lui donne du sens : une matière, un geste, un savoir-faire et un territoire.
          </p>
          <p className="mt-5 max-w-[42rem] leading-7 text-[var(--muted)]">
            Ici, le produit n'est pas séparé de son histoire. La boutique devient une porte d'entrée vers Madagascar, ses objets et les connaissances qui les entourent.
          </p>
          <Link href="/la-maison" className="link-underline mt-8 text-sm font-medium">
            Découvrir La Maison
          </Link>

          <div className="mt-14 grid sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-[var(--line)] py-5 sm:pr-8">
                <h3 className="display text-3xl">{pillar.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
