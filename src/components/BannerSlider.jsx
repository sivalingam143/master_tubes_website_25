import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "https://picsum.photos/id/1018/1200/500",
    title: "Welcome to Our Website",
    subtitle: "Build modern apps with React",
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1015/1200/500",
    title: "Fast & Responsive",
    subtitle: "Optimized for all devices",
  },
  {
    id: 3,
    image: "https://picsum.photos/id/1019/1200/500",
    title: "Clean UI",
    subtitle: "Simple & powerful design",
  },
];

export default function FadeBannerCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="fade-carousel">
        {banners.map((item, index) => (
          <div
            key={item.id}
            className={`fade-slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="fade-content">
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Dots */}
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
