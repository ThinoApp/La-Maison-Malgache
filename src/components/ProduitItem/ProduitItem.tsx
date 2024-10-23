import { Product } from "@/types/Product.type";
import "./ProduitItem.scss";
import ColorSelect from "../ColorSelect/ColorSelect";

interface ProduitItemProps {
  produit: Product;
}
const ProduitItem = ({ produit }: ProduitItemProps) => {
  return (
    <div className="ProduitItem">
      <img src={produit.images[0]} alt="images" />
      <p className="type">Art Textile</p>
      <h3>{produit.title}</h3>
      <ColorSelect colors={produit.colors} className="colors-container" />
      <p className="prix">${produit.price}</p>
    </div>
  );
};
export default ProduitItem;
