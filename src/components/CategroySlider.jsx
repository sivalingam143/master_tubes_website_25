import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import API_DOMAIN from "../config/config";
import { useNavigate } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
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
          body: JSON.stringify({
            search_text: "",
          }),
        });
        const data = await response.json();

        if (data.head && data.head.code === 200) {
          setCategories(data.body.categories);
        } else {
          console.error(
            "API Error:",
            data.head ? data.head.msg : "No response head"
          );
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
  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
    );

  return (
    <section className="slider-wrapper1">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slideToClickedSlide={true} // IMPORTANT: This makes side slides clickable
        loop={categories.length >= 3}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 3,
          },
        }}
        coverflowEffect={{
          rotate: 20, // Reduced from 30 to prevent clipping
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false, // Disabling shadows can sometimes fix overlap issues
        }}
        autoplay={{
          delay: 3000, // Increased delay to make it easier to click
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {categories.map((item) => (
          <SwiperSlide
            key={item.category_id}
            className="custom-swiper-slide"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategoryClick(item.category_id)}
          >
            <div className="slider-image-wrapper1">
              <img
                src={item.category_img_url || "https://via.placeholder.com/150"}
                alt={item.category_name}
                className="slider-image"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>
            <p
              className="slider-name1"
              style={{
                background: "linear-gradient(90deg, #fc9f2e, #f8de73)", // Matching your site's theme
                color: "#000",
                textAlign: "center",
              }}
            >
              {item.category_name}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
