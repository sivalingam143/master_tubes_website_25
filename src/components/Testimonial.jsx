/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import API_DOMAIN from "../config/config";

export default function Testimonial() {
  const [customers, setCustomers] = useState([]);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // 1. Changed endpoint to feedback.php
        const response = await fetch(`${API_DOMAIN}/feedback.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 2. Added action: "list" as required by your PHP code
          body: JSON.stringify({ action: "list" }),
        });

        const data = await response.json();

        // 3. Update logic to check for result.body.feedbacks
        if (data.head.code === 200 && data.body.feedbacks) {
          setCustomers(data.body.feedbacks);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  /* Responsive logic */
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 992 ? 3 : 1);
      setIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Auto play logic */
  useEffect(() => {
    if (customers.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, [customers.length]);

  /* Infinite loop handler */
  useEffect(() => {
    if (customers.length > 0 && index === customers.length) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(0);
      }, 600);
    } else {
      setEnableTransition(true);
    }
  }, [index, customers.length]);

  const sliderItems =
    customers.length > 0
      ? [...customers, ...customers.slice(0, itemsPerView)]
      : [];

  return (
    <section className="slider-wrapper align-content-center m-0">
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${(100 / itemsPerView) * index}%)`,
            transition: enableTransition ? "transform 0.6s ease" : "none",
          }}
        >
          {sliderItems.map((item, i) => (
            <div key={i} className="slider-slide p-2">
              <div className="testimonial shadow-sm p-4 h-100 bg-white rounded border">
                {/* 1. Star Icons */}
                <div className="mb-2">
                  {[...Array(5)].map((_, starIdx) => (
                    <FaStar
                      key={starIdx}
                      color={
                        starIdx < parseInt(item.rating) ? "#ffc107" : "#e4e5e9"
                      }
                      size={18}
                      className="mx-1"
                    />
                  ))}
                </div>

                {/* 2. Feedback Text */}
                <div className="mb-3">
                  <p
                    className="title-font italic"
                    style={{ fontSize: "0.95rem", color: "#555" }}
                  >
                    "{item.feedback}"
                  </p>
                </div>

                {/* 3. Name and City - Updated to match new table fields */}
                <div className="body-font fw-bold" style={{ color: "#e92e2e" }}>
                  {item.name}
                  <div className="small text-muted fw-normal">
                    {item.city || ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}