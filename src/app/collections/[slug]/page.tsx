import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/product-card";
import { catalogItems, collections } from "@/data/catalog";
import { getCollection } from "@/lib/catalog";

export function generateStaticParams() { return collections.map((collection) => ({ slug: collection.slug })); }

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = catalogItems.filter((item) => collection.itemSlugs.includes(item.slug));
  return (
    <div className="site-shell py-16 sm:py-24">
      <header className="max-w-4xl pb-14 sm:pb-20">
        <h1 className="display text-5xl leading-[0.92] sm:text-7xl">{collection.name}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{collection.introduction}</p>
      </header>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <ProductCard item={item} key={item.slug} />)}</div>
    </div>
  );
}
