import { motion } from "framer-motion";
import "./CTA.scss";

const Cta = () => {
  const categories = [
    {
      id: 1,
      title: "CHEFS D'OEUVRE MALAGASY",
      description: "Artisanat traditionnel et objets d'art",
      link: "/produits?categorie=chefs-oeuvre",
    },
    {
      id: 2,
      title: "TENUS VESTIMENTAIRES",
      description: "Vêtements et accessoires de mode",
      link: "/produits?categorie=vestimentaires",
    },
    {
      id: 3,
      title: "ARTISTIQUES",
      description: "Sculptures et créations artistiques",
      link: "/produits?categorie=artistiques",
    },
  ];

  return (
    <section className="Cta">
      <div className="Cta-background-overlay" />

      <motion.div
        className="Cta-map"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img src="assets/images/madagascar.svg" alt="Carte de Madagascar" />
      </motion.div>

      <div className="Cta-content">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Découvrez l'authenticité des produits de Madagascar
        </motion.h3>

        <div className="categories-container">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="category-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{
                  backgroundSize: "100% 5%",
                  x: index === 0 ? 0 : index === 1 ? -10 : -35,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  transform: `translateX(${
                    index === 0 ? 0 : index === 1 ? "-10%" : "-35%"
                  })`,
                }}
                onClick={() => (window.location.href = category.link)}
              >
                {category.title}
                <span className="category-description">
                  {category.description}
                </span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="explore-button"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button>EXPLORER TOUS LES PRODUITS</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
