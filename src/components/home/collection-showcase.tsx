import Image from "next/image";
import Link from "next/link";

const collectionTiles = [
  {
    title: "Maison & décoration",
    href: "/boutique",
    image: "/assets/generated/home.webp",
    alt: "Composition éditoriale autour de la maison et des objets",
    className: "lg:col-span-7 lg:row-span-2",
  },
  {
    title: "Mode & accessoires",
    href: "/boutique",
    image: "/assets/generated/accessories.webp",
    alt: "Composition éditoriale autour des fibres, du chapeau et du sac",
    className: "lg:col-span-5",
  },
  {
    title: "Première sélection",
    href: "/collections/premiere-selection",
    image: "/assets/generated/selection.webp",
    alt: "Nature morte éditoriale de matières et d'objets",
    className: "lg:col-span-5",
  },
];

export function CollectionShowcase() {
  return (
    <section className="site-shell section-pad">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end sm:mb-14">
        <h2 className="display max-w-4xl text-balance text-4xl leading-[0.94] sm:text-6xl lg:text-7xl">
          Des objets pour habiter, porter et partager.
        </h2>
        <Link href="/boutique" className="link-underline w-fit text-sm font-medium">
          Explorer la boutique
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-12 lg:grid-rows-2">
        {collectionTiles.map((tile, index) => (
          <Link
            key={tile.title}
            href={tile.href}
            className={`group relative min-h-[22rem] overflow-hidden bg-[var(--surface)] ${tile.className} ${index === 0 ? "lg:min-h-[46rem]" : "lg:min-h-[22.5rem]"}`}
          >
            <Image
              src={tile.image}
              alt={tile.alt}
              fill
              unoptimized
              sizes={index === 0 ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 1023px) 100vw, 42vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white sm:p-8">
              <h3 className="display max-w-lg text-3xl leading-none sm:text-4xl">{tile.title}</h3>
              <span className="text-sm">Découvrir</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
