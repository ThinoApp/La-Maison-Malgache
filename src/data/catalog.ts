import type { CatalogItem, Collection } from "@/types/catalog";
export const catalogItems: CatalogItem[] = [
  { slug: "poterie", name: "Poterie", category: "Maison et décoration", image: "/assets/images/CDC_1.png", shortDescription: "Une première fiche de migration pour structurer l'objet, sa matière, son geste et son origine." },
  { slug: "chapeau", name: "Chapeau", category: "Mode et accessoires", image: "/assets/images/CDC_2.png", shortDescription: "Une pièce du catalogue historique, prête à recevoir ses informations produit vérifiées." },
  { slug: "meuble", name: "Meuble", category: "Maison et décoration", image: "/assets/images/CDC_3.png", shortDescription: "Une base éditoriale pensée pour relier usage, fabrication et contexte de création." },
  { slug: "sac", name: "Sac", category: "Mode et accessoires", image: "/assets/images/CDC_4.png", shortDescription: "Une entrée de catalogue temporaire, sans prix ni caractéristique commerciale inventée." }
];
export const collections: Collection[] = [{ slug: "premiere-selection", name: "Première sélection", introduction: "Un espace de migration pour réunir les pièces fortes avant l'arrivée du catalogue définitif.", itemSlugs: catalogItems.map((item) => item.slug) }];
