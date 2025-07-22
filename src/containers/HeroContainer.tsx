import Hero from "@/UI/Hero/Hero";
import { useEffect, useRef, useState } from "react";

const HeroContainer = () => {
  const [active, setActive] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  // Carousel data avec plus de contenu pertinent pour les produits malgaches
  const data = [
    {
      img: "assets/images/hero_1.png",
      title: "Artisanat Malgache",
      desc: "Découvrez nos créations artisanales authentiques faites à la main",
    },
    {
      img: "assets/images/CDC_2.png", // Utiliser une image différente
      title: "Collection Raphia",
      desc: "Des accessoires uniques tissés à partir de fibres naturelles",
    },
    {
      img: "assets/images/CDC_3.png", // Utiliser une image différente
      title: "Épices de Madagascar",
      desc: "Saveurs exotiques et arômes authentiques de l'île rouge",
    },
  ];

  // Défilement automatique du carousel (désactivé pour éviter le problème de scroll)
  useEffect(() => {
    // Note: on pourrait réactiver plus tard avec une vérification d'intersection observer
    // pour n'activer le carousel auto que lorsqu'il est visible
    const interval = setInterval(() => {
      // Vérifier si l'utilisateur est actuellement sur la section hero avant de changer de slide
      const heroElement = document.querySelector(".Hero");
      const rect = heroElement?.getBoundingClientRect();

      if (rect && rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setActive((prev) => (prev < data.length - 1 ? prev + 1 : 0));
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [data.length]);

  useEffect(() => {
    if (ref.current) {
      const item = ref.current.children[active] as HTMLDivElement;
      if (item) {
        // Utiliser scrollIntoView seulement si l'utilisateur regarde le carousel
        const heroElement = document.querySelector(".Hero");
        const rect = heroElement?.getBoundingClientRect();

        if (
          rect &&
          rect.top >= -window.innerHeight / 2 &&
          rect.bottom <= window.innerHeight * 1.5
        ) {
          item.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [active]);

  const handleOnClick = (type: string | number) => {
    // Si type est un nombre, c'est un index direct
    if (typeof type === "number") {
      setActive(type);
      return;
    }

    // Sinon, c'est une direction
    if (type === "left") {
      if (active > 0) setActive((prev) => prev - 1);
      else setActive(data.length - 1); // Retour au dernier slide si on est au premier
    }
    if (type === "right") {
      if (active < data.length - 1) setActive((prev) => prev + 1);
      else setActive(0); // Retour au premier slide si on est au dernier
    }
  };

  return (
    <>
      <Hero {...{ data, handleOnClick, currentSlide: active }} ref={ref} />
    </>
  );
};

export default HeroContainer;
