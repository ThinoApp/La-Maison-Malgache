import Header from "@/UI/Header/Header";
import { useEffect, useRef } from "react";

const HeaderContainer = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle("stick", window.scrollY > 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, []);
  return (
    <>
      <Header ref={headerRef} />
    </>
  );
};

export default HeaderContainer;
