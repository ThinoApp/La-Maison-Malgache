import { forwardRef, useState } from "react";
import "./Header.scss";
import {
  FiMapPin,
  FiMessageCircle,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiSearch,
  FiMenu,
} from "react-icons/fi";
import HeaderMenuContainer from "@/containers/HeaderMenuContainer";
import HeaderMenuMobileContainer from "@/containers/HeaderMenuMobileContainer";

const Header = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="Header" ref={ref}>
      <div className="Header-top">
        <img src="/assets/images/Logo.png" alt="logo LMM" />
        <div className="Header-title">
          <h1>La Maison Malgache</h1>
          <p>Votre référence en ligne sur le marché de l'artisanat malgache</p>
        </div>
        <div className="Header-menu">
          <div className="Header-menu-top">
            <div>
              <FiMapPin />
              <p>Où nous trouvez</p>
            </div>
            <div>
              <FiMessageCircle />
              <FiUser />
              <FiHeart />
              <FiShoppingBag />
            </div>
          </div>
          <div className="Header-menu-bottom">
            <FiSearch />
            <input
              type="text"
              name="search"
              placeholder="Rechercher un produit, service"
            />
          </div>
        </div>
      </div>
      <HeaderMenuContainer />
      <div className="mobile-search-input">
        <FiSearch />
        <input
          type="text"
          name="search"
          placeholder="Rechercher un produit, service"
        />
      </div>
      <HeaderMobile />
    </div>
  );
});

const HeaderMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="Header-mobile">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <FiMenu size={32} />
      </button>
      <ul className={`Header-mobile-content ${isOpen ? "flex" : "hidden"}`}>
        <li>
          <FiMapPin size={24} className="icon" />
          <p>Où nous trouvez</p>
        </li>
        <li>
          <FiMessageCircle size={24} className="icon" />
          <FiUser size={24} className="icon" />
          <FiHeart size={24} className="icon" />
          <FiShoppingBag size={24} className="icon" />
        </li>

        <HeaderMenuMobileContainer />
      </ul>
    </div>
  );
};
export default Header;
