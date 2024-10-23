import { NavLink } from "react-router-dom";
import "./HeaderMenu.scss";
import { menus } from "@/constants/menus";

const HeaderMenu = () => {
  return (
    <ul className="HeaderMenu">
      {menus.map((menu, index) => (
        <NavLink
          key={index}
          to={menu.link}
          className={({ isActive }) =>
            isActive ? "liste-item active" : "liste-item"
          }
        >
          {menu.label}
        </NavLink>
      ))}
    </ul>
  );
};

export const HeaderMenuMobile = () => {
  return (
    <>
      {menus.map((menu, index) => (
        <NavLink
          key={index}
          to={menu.link}
          className={({ isActive }) =>
            isActive ? "liste-item active" : "liste-item"
          }
        >
          {menu.label}
        </NavLink>
      ))}
    </>
  );
};
export default HeaderMenu;
