import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { catalogItems } from "@/data/catalog";

const layouts = [
  "lg:col-span-7",
  "lg:col-span-5 lg:pt-24",
  "lg:col-span-5 lg:pt-6",
  "lg:col-span-7 lg:pt-20",
];

const mediaLayouts = ["aspect-[7/6]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[7/6]"];

export function FeaturedSelection() {
  return (
    <section className="site-shell section-pad">
      <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
        <h2 className="display max-w-3xl text-4xl leading-[0.94] sm:text-6xl lg:text-7xl">
          Quelques pièces de la Maison.
        </h2>
        <Link href="/boutique" className="link-underline w-fit text-sm font-medium">
          Voir toutes les pièces
        </Link>
      </div>

      <div className="grid gap-x-5 gap-y-12 lg:grid-cols-12 lg:gap-x-7 lg:gap-y-16">
        {catalogItems.map((item, index) => (
          <div key={item.slug} className={layouts[index] ?? "lg:col-span-6"}>
            <ProductCard
              item={item}
              mediaClassName={mediaLayouts[index] ?? "aspect-[4/5]"}
              imageSizes={index % 2 === 0 ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 1023px) 100vw, 42vw"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
