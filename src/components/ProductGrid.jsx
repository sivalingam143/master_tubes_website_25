import React, { useState, useEffect } from "react";
import API_DOMAIN from "../config/config"; 
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const getNewArrivals = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/product.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });

        const data = await response.json();

        if (data.head.code === 200) {
          const arrivals = data.body.products.filter(
            (product) => product.new_arrival !== 0
          );
          setProducts(arrivals);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getNewArrivals();
  }, []);

  // 3. Create a helper function to handle both actions
  const handleShopNow = (item) => {
  navigate("/shop", { state: { selectedProduct: item } });
};

  return (
    <section>
      <div className="parent">
        {products.map((item, index) => (
          <div
            key={item.id}
            className="product-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            data-aos-duration="800"
          >
            <div>
              <img src={item.product_img_url} alt={item.product_name} />
            </div>
            <div>
              <h4>{item.product_name}</h4>
              {/* 4. Update the onClick to use the helper function */}
              <button className="shop_now" onClick={() => handleShopNow(item)}>
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;