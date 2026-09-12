import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { catalogItems } from "@/data/catalog";
export function FeaturedSelection() { return <section className="site-shell border-t border-[var(--line)] py-16 sm:py-24"><div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"><h2 className="display text-4xl sm:text-5xl">Première sélection</h2><Link href="/boutique" className="link-underline w-fit text-sm">Voir toute la boutique</Link></div><div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-4">{catalogItems.map((item) => <ProductCard item={item} key={item.slug} />)}</div></section>; }
