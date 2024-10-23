import { MenuIcon, X } from "lucide-react";
import "./ProduitsTendances.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProduitsTendances = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="ProduitsTendances">
      <button onClick={() => setActive(true)}>
        <MenuIcon className="icon" />
        Tendances / Offres
      </button>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="ProduitsTendances-menus"
      >
        <h2>Nos Tendances</h2>
        <ul>
          <li>Les arts de Terre</li>
          <li>Les arts textile</li>
          <li>Les arts de Cuir</li>
          <li>Les arts de Bois</li>
          <li>Les arts de Fer</li>
          <li>Les arts de Verre</li>
          <li>Les arts de Plastique</li>
        </ul>
        <h2>Nos Offres</h2>
        <ul>
          <li>-40% sur "Les arts de Terre"</li>
          <li>-30% sur "Les arts textile"</li>
          <li>-20% sur "Les arts de Cuir"</li>
        </ul>
      </motion.div>
      <AnimatePresence mode="sync">
        {active && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="ProduitsTendances-menus-mobile"
          >
            <X className="close-icon" onClick={() => setActive(false)} />
            <h2>Nos Tendances</h2>
            <ul>
              <li>Les arts de Terre</li>
              <li>Les arts textile</li>
              <li>Les arts de Cuir</li>
              <li>Les arts de Bois</li>
              <li>Les arts de Fer</li>
              <li>Les arts de Verre</li>
              <li>Les arts de Plastique</li>
            </ul>
            <h2>Nos Offres</h2>
            <ul>
              <li>-40% sur "Les arts de Terre"</li>
              <li>-30% sur "Les arts textile"</li>
              <li>-20% sur "Les arts de Cuir"</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProduitsTendances;
