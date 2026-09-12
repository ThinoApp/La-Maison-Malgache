import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--background)]">
      <div className="site-shell grid gap-14 py-14 md:grid-cols-[1.5fr_0.75fr_0.75fr] md:py-18">
        <div>
          <p className="display max-w-xl text-4xl leading-[0.94] sm:text-6xl">
            Des objets à découvrir. Des histoires à transmettre.
          </p>
          <p className="mt-6 max-w-md text-sm leading-6 opacity-70">
            La Maison Malgache relie objets, matières, gestes et territoires dans une même maison.
          </p>
        </div>

        <div className="grid content-start gap-3 text-sm">
          <Link href="/boutique" className="link-underline w-fit">Boutique</Link>
          <Link href="/savoir-faire" className="link-underline w-fit">Savoir-faire</Link>
          <Link href="/la-maison" className="link-underline w-fit">La Maison</Link>
        </div>

        <div className="grid content-start gap-3 text-sm">
          <Link href="/journal" className="link-underline w-fit">Journal</Link>
          <Link href="/contact" className="link-underline w-fit">Contact</Link>
          <Link href="/panier" className="link-underline w-fit">Panier</Link>
        </div>
      </div>
    </footer>
  );
}
