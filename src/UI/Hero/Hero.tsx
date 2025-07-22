import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Hero.scss";
import { forwardRef, useEffect, useState } from "react";

interface Props {
  data: {
    img: string;
    title: string;
    desc: string;
  }[];
  handleOnClick: (type: string) => void;
  currentSlide?: number;
}

const Hero = forwardRef<HTMLDivElement, Props>(
  ({ data, handleOnClick, currentSlide = 0 }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
      return () => setIsVisible(false);
    }, [currentSlide]);

    return (
      <div className="Hero">
        <div className="Hero-carousel" ref={ref}>
          {data.map((item, index) => (
            <div className="Box-1" key={index}>
              <img src={item.img} alt={`${item.title} - produit malgache`} />
              <div className="overlay" />
              <div className="content-wrapper">
                <h2 className={isVisible ? "animate-fade-in" : ""}>
                  {item.title}
                </h2>
                <p className={isVisible ? "animate-fade-in-delay" : ""}>
                  {item.desc}
                </p>
                <button className="cta-button">Découvrir la collection</button>
              </div>
            </div>
          ))}
        </div>

        <div className="Hero-control">
          <button
            onClick={() => handleOnClick("left")}
            className="control-button"
            aria-label="Slide précédent"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => handleOnClick("right")}
            className="control-button"
            aria-label="Slide suivant"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="Hero-pagination">
          {data.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() =>
                handleOnClick(index > currentSlide ? "right" : "left")
              }
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
);

Hero.displayName = "Hero";
export default Hero;
