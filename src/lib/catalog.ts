import { catalogItems, collections } from "@/data/catalog";
export function getCatalogItem(slug: string) { return catalogItems.find((item) => item.slug === slug); }
export function getCollection(slug: string) { return collections.find((collection) => collection.slug === slug); }
