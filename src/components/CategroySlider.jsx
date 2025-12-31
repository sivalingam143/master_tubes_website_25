import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import API_DOMAIN from "../config/config";
import { useNavigate } from "react-router-dom";
import "swiper/css";
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
        effect="slide"
        grabCursor={true}
        spaceBetween={24}
        loop={categories.length >= 4}
        slidesPerView={1.2}
        breakpoints={{
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {categories.map((item) => (
          <SwiperSlide
            key={item.category_id}
            className="custom-swiper-slide"
            onClick={() => handleCategoryClick(item.category_id)}
          >
            <div className="slider-image-wrapper1">
              <img
                src={
                  item.category_img_url ||
                  "https://via.placeholder.com/300x300/ffffff/cccccc?text=No+Image"
                }
                alt={item.category_name}
                className="slider-image"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <p className="slider-name1">{item.category_name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
