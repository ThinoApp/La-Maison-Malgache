import { listes } from "@/data/CoupsDeCoeur";
import ProduitItem from "../ProduitItem/ProduitItem";
import "./ProduitsListes.scss";
const ProduitsListes = () => {
  return (
    <div className="ProduitsListes">
      {listes.map((produit) => (
        <ProduitItem key={produit.id} produit={produit} />
      ))}
    </div>
  );
};
export default ProduitsListes;
