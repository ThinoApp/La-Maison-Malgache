import type { CatalogItem, Collection } from "@/types/catalog";

export const catalogItems: CatalogItem[] = [
  {
    slug: "poterie",
    name: "Poterie",
    category: "Maison et décoration",
    image: "/assets/images/CDC_1.png",
    shortDescription: "Une pièce de la sélection Maison et décoration de La Maison Malgache.",
  },
  {
    slug: "chapeau",
    name: "Chapeau",
    category: "Mode et accessoires",
    image: "/assets/images/CDC_2.png",
    shortDescription: "Une pièce de la sélection Mode et accessoires de La Maison Malgache.",
  },
  {
    slug: "meuble",
    name: "Meuble",
    category: "Maison et décoration",
    image: "/assets/images/CDC_3.png",
    shortDescription: "Une pièce de la sélection Maison et décoration de La Maison Malgache.",
  },
  {
    slug: "sac",
    name: "Sac",
    category: "Mode et accessoires",
    image: "/assets/images/CDC_4.png",
    shortDescription: "Une pièce de la sélection Mode et accessoires de La Maison Malgache.",
  },
];

export const collections: Collection[] = [
  {
    slug: "premiere-selection",
    name: "Première sélection",
    introduction: "Une sélection de pièces réunies pour découvrir plusieurs univers de La Maison Malgache.",
    itemSlugs: catalogItems.map((item) => item.slug),
  },
];
