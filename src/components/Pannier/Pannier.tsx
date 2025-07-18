import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import "./pannier.scss";

const Pannier = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="Pannier">
      <div className="Pannier-quantity">
        <button
          onClick={() => {
            setQuantity((prev) => (prev - 1 === 0 ? 1 : prev - 1));
          }}
        >
          <FiMinus />
        </button>
        <p className="pannier-nb">{quantity}</p>
        <button
          onClick={() => {
            setQuantity((prev) => prev + 1);
          }}
        >
          <FiPlus />
        </button>
      </div>
      <button className="submit-pannier">AJOUTER AU PANIER</button>
    </div>
  );
};

export default Pannier;
