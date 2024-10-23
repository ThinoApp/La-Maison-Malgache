import { SortByType } from "@/types/SortBy.type";
import "./SortBy.scss";
import DynamicInput from "../DynamicInput/DynamicInput";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface SortByItemProps {
  type: SortByType;
  label: string;
}

const SortByItem = ({ label, type }: SortByItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className="SortByItem">
      <div className="SortByItem-input">
        <input
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
          type="checkbox"
          id={label}
          name="date"
          value={label}
        />
        <label htmlFor={label}>{label}</label>
      </div>
      {isOpen && <DynamicInput {...{ type }} />}
    </li>
  );
};

const SortBy = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="SortBy">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        Trier par
        {isOpen ? " ▲" : " ▼"}
      </button>
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="SortBy-items"
          >
            <SortByItem
              {...{
                label: "Date",
                type: SortByType.Date,
              }}
            />
            <SortByItem
              {...{
                label: "Prix",
                type: SortByType.Prix,
              }}
            />
            <li>
              <SortByItem
                {...{
                  label: "Popularité",
                  type: SortByType.Popularite,
                }}
              />
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SortBy;
