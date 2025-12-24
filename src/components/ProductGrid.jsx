import React from "react";

import Image1 from "../assets/images/shop/image1.jpeg";
import Img2 from "../assets/images/shop/image2.jpeg";
import Img3 from "../assets/images/shop/image3.jpeg";
import Img4 from "../assets/images/shop/image4.jpeg";
import Img5 from "../assets/images/shop/image5.jpeg";
import Img6 from "../assets/images/shop/image6.jpeg";

const products = [
  {
    id: 1,
    className: "div1",
    name: "Kids",
    image: Image1,
  },
  {
    id: 2,
    className: "div2",
    name: "Return Gifts",
    image: Img2,
  },
  {
    id: 3,
    className: "div3",
    name: "Classic",
    image: Img3,
  },
  {
    id: 4,
    className: "div4",
    name: "Calender",
    image: Img4,
  },
  {
    id: 5,
    className: "div5",
    name: "Cartoon",
    image: Img5,
  },
  {
    id: 6,
    className: "div6",
    name: "PaperBoard",
    image: Img6,
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
