import { Product } from "@/types/Product.type";
import "./Gallery.scss";

interface GalleryProps {
  activeImage: string;
  setActiveImage: (image: string) => void;
  product: Product;
}
const Gallery = ({ activeImage, product, setActiveImage }: GalleryProps) => {
  return (
    <div className="Gallery">
      <img src={activeImage} alt="coup de coeur detail" />
      {product.images
        .filter((item) => item !== activeImage)
        .map((image, index) => (
          <img
            src={image}
            alt="coup de coeur detail"
            key={index}
            onClick={() => setActiveImage(image)}
          />
        ))}
    </div>
  );
};
export default Gallery;
