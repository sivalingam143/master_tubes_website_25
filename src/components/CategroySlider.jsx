import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import API_DOMAIN from "../config/config";
import { useNavigate } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

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
           
            fetch_all: true,
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
        // Essential fix for 3 images:
        loop={categories.length >= 3}
        slidesPerView={1} // Default for mobile
        breakpoints={{
          // On larger screens, show roughly 3 slides to see the one on the right
          768: {
            slidesPerView: 3,
          },
        }}
        coverflowEffect={{
          rotate: 30, // Reduced rotation to prevent clipping
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true, // Turn off shadows if clipping occurs
        }}
        autoplay={{
          delay: 1000,
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
            style={{ cursor: 'pointer' }} // Make it look clickable
            onClick={() => handleCategoryClick(item.category_id)}// Trigger navigation
          >
            <div className="slider-image-wrapper1">
              <img
                src={item.category_img_url || "https://via.placeholder.com/150"}
                alt={item.category_name}
                className="slider-image"
              />
            </div>
            <p
              className="slider-name1"
              style={{ background: "red", color: "#fff", textAlign: "center" }}
            >
              {item.category_name}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
