import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import API_DOMAIN from "../config/config";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./categoryslider.css";

export default function HeroSlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/category.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });
        const data = await response.json();

        if (data.head && data.head.code === 200) {
          setCategories(data.body.categories);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };
  const settings = {
    infinite: categories.length >= 2,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "0%",
          variableWidth: false,
          arrows: false,
          autoplaySpeed: 3000,
          swipeToSlide: true,
          touchThreshold: 10,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "0%",
          variableWidth: false,
          arrows: false,
          autoplaySpeed: 3000,
          swipeToSlide: true,
          touchThreshold: 10,
        },
      },
    ],
  };
  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <section className="slider-wrapper1">
      <Slider {...settings} className="category-slick-slider">
        {categories.map((item) => (
          <div key={item.category_id} className="slick-item-padding">
            <div
              className="custom-category-card"
              onClick={() => handleCategoryClick(item.category_id)}
            >
              <div className="slider-image-wrapper1">
                <img
                  src={
                    item.category_img_url ||
                    "https://via.placeholder.com/300x300"
                  }
                  alt={item.category_name}
                  className="slider-image"
                />
              </div>
              <p className="slider-name1">{item.category_name}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
