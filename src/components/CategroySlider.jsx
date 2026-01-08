// CategorySlider.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../config/config";
import "./CategorySlider.css"; // Import the CSS

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const singleSetWidthRef = useRef(0);
  const currentPosRef = useRef(0);
  const scrollSpeed = 1.5; // Reduced for slower, more user-friendly speed (~90px/sec at 60fps)

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

  useEffect(() => {
    if (
      !loading &&
      categories.length > 0 &&
      sliderRef.current &&
      trackRef.current
    ) {
      const slider = sliderRef.current;
      const track = trackRef.current;
      singleSetWidthRef.current = track.scrollWidth / 2; // Half because duplicated

      const animate = () => {
        currentPosRef.current =
          (currentPosRef.current + scrollSpeed) % singleSetWidthRef.current;
        track.style.transform = `translateX(${-currentPosRef.current}px)`;
        animationRef.current = requestAnimationFrame(animate);
      };

      // Initial setup
      currentPosRef.current = 0;
      track.style.transform = `translateX(0px)`;

      // Small delay to ensure DOM measurements
      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 100);

      // Pause on hover/touch
      const handlePause = () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      const handleResume = () => {
        // Continue from current position, no reset
        animationRef.current = requestAnimationFrame(animate);
      };

      slider.addEventListener("mouseenter", handlePause);
      slider.addEventListener("mouseleave", handleResume);
      slider.addEventListener("touchstart", handlePause, { passive: true });
      slider.addEventListener("touchend", handleResume, { passive: true });

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        slider.removeEventListener("mouseenter", handlePause);
        slider.removeEventListener("mouseleave", handleResume);
        slider.removeEventListener("touchstart", handlePause);
        slider.removeEventListener("touchend", handleResume);
      };
    }
  }, [loading, categories]);

  const handleshopNowClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  if (loading) {
    return <div className="category-slider-loading">Loading categories...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="category-slider-empty">No categories available.</div>
    );
  }

  // Duplicate categories for seamless infinite loop
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="category-slider-container">
      <div className="category-slider" ref={sliderRef}>
        <div className="category-slider-track" ref={trackRef}>
          {duplicatedCategories.map((category, index) => (
            <div key={`${category.id}-${index}`} className="category-slide">
              <div className="category-content">
                <img
                  src={category.category_img_url}
                  alt={category.category_name}
                  className="category-image"
                />
                <span className="category-name">{category.category_name}</span>
                <button
                  className="shop-now-btn"
                  onClick={() => handleshopNowClick(category.category_id)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
