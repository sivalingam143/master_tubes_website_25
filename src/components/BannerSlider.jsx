import { useEffect, useState } from "react";
import API_DOMAIN from "../config/config";

export default function FadeBannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
            const response = await fetch(`${API_DOMAIN}/banner.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Your PHP code looks for 'search_text' to return the banner list
          body: JSON.stringify({ search_text: "" }), 
        });

        const data = await response.json();

        if (data.head.code === 200 && data.body.banner_one) {
          setBanners(data.body.banner_one);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 2. Auto play logic
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading) return null; // Or a small inline spinner
  if (banners.length === 0) return <p>No banners available.</p>;

  return (
    <section>
      <div className="fade-carousel">
        {banners.map((item, index) => (
          <div
            key={item.id}
            className={`fade-slide ${index === current ? "active" : ""}`}
            style={{ 
              backgroundImage: `url(${item.img})`, // Using 'img' from your PHP output
              backgroundColor: '#cccccc' // Fallback color
            }}
          >
            <div className="fade-content">

              <h2>{item.title || ""}</h2>
              <p>{item.subtitle || ""}</p>
            </div>
          </div>
        ))}

        <div className="fade-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`fade-dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}