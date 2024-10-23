import { useState } from "react";
import "./ColorSelect.scss";

interface ColorSelectProps {
  colors: string[];
  className?: string;
}
const ColorSelect = ({ colors, className }: ColorSelectProps) => {
  const [activeColor, setActiveColor] = useState(0);

  return (
    <p className={"colors " + className}>
      {colors.map((color, index) => (
        <span
          onClick={() => setActiveColor(index)}
          className={`${activeColor === index ? "active" : ""}`}
          key={index}
          style={{ backgroundColor: color }}
        ></span>
      ))}
    </p>
  );
};
export default ColorSelect;
