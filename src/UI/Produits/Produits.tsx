import ProduitsTendances from "@/components/ProduitsTendances/ProduitsTendances";
import "./Produits.scss";
import ProduitsFilters from "@/components/ProduitsFilters/ProduitsFilters";
import ProduitsListes from "@/components/ProduitsListes/ProduitsListes";
const Produits = () => {
  return (
    <div className="Produits">
      <ProduitsTendances />
      <ProduitsFilters />
      <ProduitsListes />
    </div>
  );
};
export default Produits;
