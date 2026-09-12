import { CraftStory } from "@/components/home/craft-story";
import { FeaturedSelection } from "@/components/home/featured-selection";
import { HomeHero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { PlaceStory } from "@/components/home/place-story";

export default function HomePage() {
  return <><HomeHero /><Manifesto /><FeaturedSelection /><CraftStory /><PlaceStory /></>;
}
