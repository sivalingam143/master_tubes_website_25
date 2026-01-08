import React, { useState, useEffect } from "react";
import API_DOMAIN from "../config/config"; 
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  // FIXED: Added 'id' as a parameter to the function
  const handleShopNow = (id) => {
    navigate(`/prdt/${id}`);
  };

  return (
    <section>
      <div className="parent">
        {products.map((item, index) => (
          <div
            key={item.product_id}
            className="product-card"
            data-aos="zoom-in"
            data-aos-delay={index * 100}
            data-aos-duration="800"
          >
            <div>
              <img src={item.product_img_url} alt={item.product_name} />
            </div>
            <div>
              <h4 className="body-font">{item.product_name}</h4>
              <button 
                className="shop_now" 
                // Passing the specific product_id here
                onClick={() => handleShopNow(item.product_id)}
              >
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