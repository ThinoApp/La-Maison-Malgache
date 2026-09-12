import { CollectionShowcase } from "@/components/home/collection-showcase";
import { CraftStory } from "@/components/home/craft-story";
import { FeaturedSelection } from "@/components/home/featured-selection";
import { HomeHero } from "@/components/home/hero";
import { JournalPreview } from "@/components/home/journal-preview";
import { Manifesto } from "@/components/home/manifesto";
import { PlaceStory } from "@/components/home/place-story";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <CollectionShowcase />
      <CraftStory />
      <FeaturedSelection />
      <PlaceStory />
      <JournalPreview />
    </>
  );
}
