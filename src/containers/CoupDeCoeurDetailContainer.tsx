import Gallery from "@/components/Gallery/Gallery";
import { listes } from "@/data/CoupsDeCoeur";
import { Product } from "@/types/Product.type";
import CoupDeCoeurDetail from "@/UI/CoupDeCoeurDetail/CoupDeCoeurDetail";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CoupDeCoeurDetailContainer = () => {
  const { id } = useParams();
  if (!id) throw new Error("id is required");
  const product = listes.find((item) => item.id === Number(id)) as Product;
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <>
      <CoupDeCoeurDetail
        {...{
          product,
          renderGallery: () => (
            <Gallery
              {...{
                activeImage,
                product,
                setActiveImage,
              }}
            />
          ),
        }}
      />
    </>
  );
};

export default CoupDeCoeurDetailContainer;
