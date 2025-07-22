import "./CoupDeCoeur.scss";
import { motion } from "framer-motion";
import { Product } from "@/types/Product.type";
import { useNavigate } from "react-router-dom";
import ColorSelect from "@/components/ColorSelect/ColorSelect";
import { FiShoppingBag, FiHeart, FiEye } from "react-icons/fi";

interface CoupsDeCoeurItemProps {
  item: Product;
}

interface CoupDeCoeurProps {
  listes: Product[];
}

const CoupDeCoeur = ({ listes }: CoupDeCoeurProps) => {
  return (
    <section className="CoupDeCoeur">
      <div className="section-header">
        <h2>COUPS DE CŒUR DU MOMENT</h2>
        <p className="section-subtitle">
          Découvrez notre sélection de produits artisanaux malgaches
        </p>
      </div>

      <div className="CoupDeCoeur-container">
        {listes.map((item, index) => (
          <CoupDeCoeurItem item={item} key={index} />
        ))}
      </div>

      <motion.div
        className="view-all-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button>VOIR TOUS LES PRODUITS</button>
      </motion.div>
    </section>
  );
};

const CoupDeCoeurItem = ({ item }: CoupsDeCoeurItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="Card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * item.id }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="Card-image-container">
        <img src={item.images[0]} alt={`${item.title} - produit malgache`} />
        <div className="Card-overlay">
          <motion.div
            className="Card-actions"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              className="action-button"
              onClick={() => navigate(`/coup-de-coeur/detail/${item.id}`)}
              aria-label="Voir détails"
            >
              <FiEye />
            </button>
            <button className="action-button" aria-label="Ajouter aux favoris">
              <FiHeart />
            </button>
            <button
              className="action-button"
              onClick={() => navigate(`/coup-de-coeur/detail/${item.id}`)}
              aria-label="Ajouter au panier"
            >
              <FiShoppingBag />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="Card-content">
        <h3>{item.title}</h3>
        <div className="Card-details">
          <p className="price">€ {item.price}</p>
          <ColorSelect colors={item.colors} />
        </div>
        <motion.button
          className="add-to-cart-button"
          onClick={() => navigate(`/coup-de-coeur/detail/${item.id}`)}
          whileHover={{ backgroundColor: "#6e5c43", color: "#fff" }}
          transition={{ duration: 0.3 }}
        >
          AJOUTER AU PANIER
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CoupDeCoeur;
