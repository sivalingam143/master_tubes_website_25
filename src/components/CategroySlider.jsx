/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import Pots from "../assets/images/home/pots.webp";
import Spark from "../assets/images/home/spark.webp";
import Bomb from "../assets/images/home/bomb.webp";
import Chakkar from "../assets/images/home/chakkar.webp";

const slides = [
  {
    id: 1,
    name: "Flower Pots",
    image: Pots,
    radius: "60% 40% 70% 30% / 40% 60% 30% 70%",
    bgColor: "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
    textColor: "#000",
  },
  {
    id: 2,
    name: "Sparklers",
    image: Spark,
    radius: "20px 80px 40px 100px",
    bgColor: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
    textColor: "#fff",
  },
  {
    id: 3,
    name: "Bombs",
    image: Bomb,
    radius: "100px 30px 120px 50px",
    bgColor: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
    textColor: "#000",
  },
  {
    id: 4,
    name: "Chakkar",
    image: Chakkar,
    radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
    bgColor: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)",
    textColor: "#000",
  },
];

export default function HeroSlider() {
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
              <img
                src={item.image}
                alt={item.name}
                className="slider-image"
                style={{ borderRadius: item.radius }}
              />

              <p
                className="slider-name"
                style={{
                  background: item.bgColor,
                  color: item.textColor,
                }}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
