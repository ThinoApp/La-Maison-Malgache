import { useState } from "react";
import "./ArrangementButton.scss";
const ArrangementButton = () => {
  const [isCroissant, setIsCroissant] = useState(true);
  return (
    <button
      className="ArrangementButton"
      onClick={() => setIsCroissant((prev) => !prev)}
    >
      Arrangement :&nbsp;
      <span className="text-primary font-medium text-xl">
        {isCroissant ? "Croissant" : "Decroissant"}
      </span>
    </button>
  );
};
export default ArrangementButton;
