import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogItems } from "@/data/catalog";
import { getCatalogItem } from "@/lib/catalog";

export function generateStaticParams() { return catalogItems.map((item) => ({ slug: item.slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCatalogItem(slug);
  if (!item) notFound();
  return (
    <article className="site-shell py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-0 lg:border-x lg:border-[var(--line)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)] lg:min-h-[78svh] lg:aspect-auto">
          <Image src={item.image} alt={item.name} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-between lg:border-l lg:border-[var(--line)] lg:p-12 xl:p-16">
          <div><p className="text-sm text-[var(--muted)]">{item.category}</p><h1 className="display mt-4 text-6xl leading-[0.9] sm:text-7xl">{item.name}</h1><p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">{item.shortDescription}</p></div>
          <div className="mt-14 border-t border-[var(--line)] pt-7"><p className="max-w-md text-sm leading-6 text-[var(--muted)]">Prix, stock, variantes, dimensions, origine précise, matière et atelier restent volontairement absents tant que ces données ne sont pas confirmées.</p><Link href="/contact" className="link-underline mt-7 text-sm font-medium">Demander les informations disponibles</Link></div>
        </div>
      </div>
    </article>
  );
}
