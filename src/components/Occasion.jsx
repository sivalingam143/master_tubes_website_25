/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import Pots from "../assets/images/home/oc_one.webp";
import Spark from "../assets/images/home/oc_two.webp";
import Bomb from "../assets/images/home/oc_three.webp";
import Chakkar from "../assets/images/home/oc_four.webp";

const slides = [
  {
    image: Pots,
  },
  {
    id: 2,

    image: Spark,
  },
  {
    image: Bomb,
  },
  {
    image: Chakkar,
  },
];

export default function Occasion() {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  /* Responsive */
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 992 ? 3 : 1);
      setIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Auto play */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  /* Infinite loop handler */
  useEffect(() => {
    if (index === slides.length) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(0);
      }, 600); // must match CSS transition
    } else {
      setEnableTransition(true);
    }
  }, [index]);

  /* Clone slides */
  const sliderItems = [...slides, ...slides.slice(0, itemsPerView)];

  return (
    <section className="slider-wrapper">
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${(100 / itemsPerView) * index}%)`,
            transition: enableTransition ? "transform 0.6s ease" : "none",
          }}
        >
          {sliderItems.map((item, i) => (
            <div key={i} className="slider-slide">
              <img src={item.image} alt={item.name} className="slider-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
