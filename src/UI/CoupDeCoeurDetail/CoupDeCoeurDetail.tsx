import { Product } from "@/types/Product.type";
import "./CoupDeCoeurDetail.scss";
import Pannier from "@/components/Pannier/Pannier";
import ColorSelect from "@/components/ColorSelect/ColorSelect";

interface CoupDeCoeurDetailProps {
  product: Product;
  renderGallery: () => JSX.Element;
}
const CoupDeCoeurDetail = ({
  product,
  renderGallery,
}: CoupDeCoeurDetailProps) => {
  return (
    <div className="CoupDeCoeurDetail">
      {renderGallery()}
      <div className="CoupDeCoeurInfo">
        <h2>{product.title}</h2>
        <p className="description">{product.description}</p>
        <p className="price">
          Prix : <span>€ {product.price}</span>
        </p>

        <ColorSelect colors={product.colors} />

        <div className="w-full my-auto">
          <Pannier />
        </div>
      </div>
    </div>
  );
};
export default CoupDeCoeurDetail;
