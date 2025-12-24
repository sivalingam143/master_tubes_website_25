import React from "react";

import Img1 from "../assets/images/home/shotsseven.webp";
import Img2 from "../assets/images/home/shots120.webp";
import Img3 from "../assets/images/home/shots12.webp";
import Img4 from "../assets/images/home/twink.webp";
import Img5 from "../assets/images/Logo_1.avif";

const products = [
  {
    id: 1,
    className: "div1",
    name: "Flower Pots",
    image: Img1,
  },
  {
    id: 2,
    className: "div2",
    name: "Sparklers",
    image: Img2,
  },
  {
    id: 3,
    className: "div3",
    name: "Sparklers",
    image: Img3,
  },
  {
    id: 4,
    className: "div4",
    name: "Sparklers",
    image: Img4,
  },
  {
    id: 5,
    className: "div5",
    name: "Sparklers",
    image: Img5,
  },
  {
    id: 6,
    className: "div6",
    name: "Sparklers",
    image: Img5,
  },
];

const ProductGrid = () => {
  return (
    <section >
      <div className="parent">
        {products.map((item) => (
          <div key={item.id} className={`${item.className} product-card`}>
            <div>
              <img src={item.image} alt={item.name} />
            </div>
            <div>
              <h4>{item.name}</h4>
              <button className="shop_now">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
