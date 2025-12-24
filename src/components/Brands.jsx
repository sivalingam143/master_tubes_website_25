/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import Img1 from "../assets/images/home/Ellipse_3.avif";
import Img2 from "../assets/images/home/Ellipse_3.avif";
import Img3 from "../assets/images/home/Ellipse_3.avif";
import Img4 from "../assets/images/home/Ellipse_3.avif";
import Img5 from "../assets/images/home/Ellipse_3.avif";

const slides = [
  { image: Img1 },
  { image: Img2 },
  { image: Img3 },
  { image: Img4 },
  { image: Img5 },
];

export default function Brands() {
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [enableTransition, setEnableTransition] = useState(true);

  /* Responsive */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setItemsPerView(5); // Desktop
      } else {
        setItemsPerView(2); // Mobile
      }
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

  /* Infinite loop fix */
  useEffect(() => {
    if (index === slides.length) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(0);
      }, 700);
    } else {
      setEnableTransition(true);
    }
  }, [index]);

  const sliderItems = [...slides, ...slides.slice(0, itemsPerView)];

  return (
    <section className="brands-slider">
      <div className="brands-container">
        <div
          className="brands-track"
          style={{
            transform: `translate3d(-${
              (100 / itemsPerView) * index
            }%, 0, 0)`,
            transition: enableTransition
              ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        >
          {sliderItems.map((item, i) => (
            <div key={i} className="brands-slide">
              <div className="brand-card">
                <img src={item.image} alt="Brand Logo" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
