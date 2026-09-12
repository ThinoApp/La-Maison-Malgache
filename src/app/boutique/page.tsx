import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/product-card";
import { catalogItems } from "@/data/catalog";

export const metadata: Metadata = { title: "Boutique", description: "Première structure du catalogue La Maison Malgache." };

export default function BoutiquePage() {
  return (
    <div className="site-shell py-16 sm:py-24">
      <header className="max-w-4xl pb-14 sm:pb-20">
        <h1 className="display text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">Boutique</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Le catalogue est désormais structuré pour accueillir catégories, collections, matières, ateliers et informations commerciales vérifiées.</p>
      </header>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {catalogItems.map((item) => <ProductCard item={item} key={item.slug} />)}
      </div>
    </div>
  );
}
