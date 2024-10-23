import "./CoupDeCoeur.scss";
import { motion } from "framer-motion";
import { Product } from "@/types/Product.type";
import { useNavigate } from "react-router-dom";
import ColorSelect from "@/components/ColorSelect/ColorSelect";

interface CoupsDeCoeurItemProps {
  item: Product;
}

interface CoupDeCoeurProps {
  listes: Product[];
}

const CoupDeCoeur = ({ listes }: CoupDeCoeurProps) => {
  return (
    <div className="CoupDeCoeur">
      <h2>COUPS DE CŒUR DU MOMENT</h2>
      <div className="CoupDeCoeur-container">
        {listes.map((item, index) => (
          <CoupDeCoeurItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
};

const CoupDeCoeurItem = ({ item }: CoupsDeCoeurItemProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="Card"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 * item.id }}
    >
      <img src={item.images[0]} alt="hero images" />
      <h3>{item.title}</h3>
      <p className="price">€ {item.price}</p>
      <ColorSelect colors={item.colors} />
      <button onClick={() => navigate(`/coup-de-coeur/detail/${item.id}`)}>
        AJOUTER AU PANIER
      </button>
    </motion.div>
  );
};
export default CoupDeCoeur;
