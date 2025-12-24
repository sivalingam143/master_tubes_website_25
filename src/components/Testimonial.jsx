/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import Pots from "../assets/images/home/Ellipse_3.avif";
import Spark from "../assets/images/home/Ellipse_3.avif";
import Bomb from "../assets/images/home/Ellipse_3.avif";
import Chakkar from "../assets/images/home/Ellipse_3.avif";

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

export default function Testimonial() {
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
    <section className="slider-wrapper align-content-center">
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${(100 / itemsPerView) * index}%)`,
            transition: enableTransition ? "transform 0.6s ease" : "none",
          }}
        >
          {sliderItems.map((item, i) => (
            <div key={i} className="slider-slide ">
              <div className="testimonial">
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className=""
                  />
                </div>
                <div>
                  <div>
                    <p className="title-font">
                      Last Diwali purchased plethora of crackers for my entire
                      family from their online store!
                    </p>
                  </div>
                  <div className="body-font">Aswathi (Lucknow)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
