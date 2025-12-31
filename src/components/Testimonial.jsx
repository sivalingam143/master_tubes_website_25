/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"; // Ensure react-icons is installed
import API_DOMAIN from "../config/config";
import DefaultUser from "../assets/images/home/Ellipse_3.avif";

export default function Testimonial() {
  const [customers, setCustomers] = useState([]);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/customer.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });
        const data = await response.json();
        if (
          (data.head.code === 200 || data.head.code === 400) &&
          data.body.customer
        ) {
          const filtered = data.body.customer.filter(
            (c) =>
              c.feedback && c.feedback.trim() !== "" && parseInt(c.rating) > 0
          );
          setCustomers(filtered);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);
  const getCityFromAddress = (addressString) => {
    try {
      if (!addressString || addressString === "") return "";
      const addressObj = JSON.parse(addressString);
      return addressObj.city || "";
    } catch (error) {
      return "";
    }
  };

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

  // if (customers.length === 0)
  //   return <p className="text-center">No feedback yet.</p>;

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
                {/* 1. Star Icons First */}
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

                {/* 3. Name and Place */}
                <div className="body-font fw-bold" style={{ color: "#e92e2e" }}>
                  {item.first_name} {item.last_name || ""}
                  <div className="small text-muted fw-normal">
                    {getCityFromAddress(item.delivery_address)}
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
