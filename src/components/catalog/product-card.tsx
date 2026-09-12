import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";

type ProductCardProps = {
  item: CatalogItem;
  mediaClassName?: string;
  imageSizes?: string;
};

export function ProductCard({ item, mediaClassName = "aspect-[4/5]", imageSizes = "(max-width: 767px) 92vw, 45vw" }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/produit/${item.slug}`} className="block">
        <div className={`relative overflow-hidden bg-[var(--surface)] ${mediaClassName}`}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--line)] py-4">
          <div>
            <h3 className="display text-2xl sm:text-3xl">{item.name}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{item.category}</p>
          </div>
          <span className="self-start text-sm text-[var(--muted)]">Voir</span>
        </div>
      </Link>
    </article>
  );
}
