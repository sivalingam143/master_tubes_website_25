import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import BannerCarousel from "../components/BannerSlider";
import { Container, Row, Col } from "react-bootstrap";
import HeroCarousel from "../components/CategroySlider";
import ProductGrid from "../components/ProductGrid";
import CenterBanner from "../assets/images/home/centerbanner.webp";
import ReferBanner from "../assets/images/category/money.webp";
import Occasion from "../components/Occasion";
import TopSell from "../assets/images/category/fancy.webp";
import Selling from "../assets/images/home/EarlyCrackers.webp";
import Rectangle2 from "../assets/images/home/piggybank_img_01.jpg";
import Rectangle from "../assets/images/home/Rectangle.webp";
import { FaRegMap, FaTags } from "react-icons/fa";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { TbCirclePercentage } from "react-icons/tb";
import { MdAddShoppingCart } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Testimonial from "../components/Testimonial";
import API_DOMAIN from "../config/config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [topProducts, setTopProducts] = useState([]);     // ← empty array instead of null
  const { addToDetails } = useCart();
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Crucial: This makes it look like the first design
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Inside Home.jsx - Update your videoSliderSettings
const videoSliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false, // Global autoplay off
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: { 
        slidesToShow: 3,
        autoplay: false 
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3, 
        centerMode: true,
        centerPadding: '10px',
        arrows: false,
        autoplay: false // Ensure it's off here
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 3, 
        centerMode: true,
        centerPadding: '5px', 
        arrows: false,
        autoplay: false // Stops automatic sliding on mobile
      }
    }
  ]
};

// Inside the Video Section map function, ensure the URL has the correct parameters
const getEmbedUrl = (link) => {
  if (!link) return "";
  let videoId = "";
  if (link.includes("shorts/")) {
    videoId = link.split("shorts/")[1]?.split("?")[0];
  } else if (link.includes("v=")) {
    videoId = link.split("v=")[1]?.split("&")[0];
  } else if (link.includes("youtu.be/")) {
    videoId = link.split("youtu.be/")[1]?.split("?")[0];
  }
  // Added &origin to help the iframe initialize correctly without refresh
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
}
  useEffect(() => {

    // Fetch Videos
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/banner_video.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });
        const data = await response.json();
        if (data.head.code === 200) {
          setVideos(data.body.videos); // From your Postman output
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {

    // Fetch Top Products
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/product.php`, {  // ← use product.php
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_text: "" }),
        });

        const data = await response.json();

        if (data.head.code === 200) {
          // Filter only top selling products
          const filtered = data.body.products.filter(p => p.top_selling === 1);
          setTopProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    }

    fetchTopProducts();

    AOS.init({
      duration: 1000,
      once: true,
      // Higher offset means you have to scroll deeper into the section to trigger it
      offset: 400,
      // This is the most important setting for your issue:
      anchorPlacement: "top-bottom",
      easing: "ease-in-out",
    });

    // Refresh to make sure AOS knows the correct positions after the page renders
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);


  return (
    <>
      <BannerCarousel />
      <section className="category-bg">
        <Container className="py-3">
          <Row>
            <Col lg="12">
              <div className="shop-category text-center body-font">
                Shop By Categrory
              </div>
            </Col>
            <Col lg="12">
              <HeroCarousel />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="product-grids overflow-hidden">
        <Container className="py-3">
          <Row>
            <Col lg="12" className="py-5 mb-3 mx-auto">
              <div
                className="d-flex justify-content-center"
                data-aos="fade-up" // Ribbon slides up
              >
                <div className="ribbon body-font">New Arrival</div>
              </div>
            </Col>
            <Col lg="12">
              <ProductGrid />
            </Col>
          </Row>
        </Container>
      </section>
      {/* categrory section end */}
      {/* <section className="photo-grids">
        <Container fluid className="px-0">
          <Row>
            <Col lg="12">
              <img src={CenterBanner} className="img-fluid w-100" />
            </Col>
          </Row>
        </Container>
      </section> */}

      <section className="overflow-hidden">
        <Container fluid>
          <Row>
            <Col
              lg="6"
              className="p-5 align-content-center"
              data-aos="fade-right"
            >
              <div>
                <h2 className="body-font">
                  Refer mastertubes.com to your friends
                </h2>
                <p className="title-font">
                  Refer Piggy Bank to your friends and family, turn small
                  savings into memorable special moments!
                </p>
                {/* <div>
                  <button className="shop_now body-font" disabled={true}>Shop Now</button>
                </div> */}
              </div>
            </Col>
            <Col lg="6" className="p-0" data-aos="fade-left">
              <img
                src={ReferBanner}
                className="img-fluid w-100"
                alt="Referral Banner"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* <section className="py-5 occasion">
        <Container fluid>
          <Row>
            <Col lg="12 ">
              <h3 className="pb-5 text-center body-font">Shop By Occasion</h3>
              <Occasion />
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* Section 2: Top Selling Products */}
      <section id="top-selling-section" className="py-5 top_sell overflow-hidden">
        <Container>
          <div className="text-center mb-3" data-aos="fade-up">
            <h2 className="body-font">TOP SELLING PRODUCTS</h2>
          </div>

          {/* Wrap the map in the Slider component */}
          <Slider {...sliderSettings}>
            {topProducts.map((product) => (
              <div key={product.product_id} className="px-2">
                <div className="top-selling-wrapper">
                  <Row className="align-items-center">
                    {/* Left Side: Product Image */}
                    <Col md={6} className="text-center">
                      <div className="product-img-container">
                        <img
                          src={product.product_img_url}
                          alt={product.product_name}
                          className="img-fluid main-product-img"
                        />
                      </div>
                    </Col>

                    {/* Right Side: Product Details */}
                    <Col md={6} className="product-details-content text-start">
                      <h2 className="product-title body-font">{product.product_name}</h2>
                      <div className="price-section mb-3">
                        <span className="old-price">Rs. {product.old_price || '300.00'}</span>
                        <span className="new-price ml-2">Rs. {product.price || '64.00'}</span>
                      </div>
                      <p className="product-description title-font">
                        {product.description || "Start the New Year with smart savings and positive habits!"}
                      </p>
                      <button
                        className="shop_now_btn body-font"
                        onClick={() => addToDetails(product, 1)}
                      >
                        Add To Cart
                      </button>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
          </Slider>
        </Container>
      </section>

      {/* <section className="py-5">
        <Container fluid className="px-0">
          <Row>
            <Col lg="12">
              <img src={Selling} className="img-fluid w-100" />
            </Col>
          </Row>
        </Container>
      </section> */}
      <section id="why-we-section" className="overflow-hidden py-5">
        {/* overflow-hidden prevents horizontal scrollbars during animation */}
        <Container>
          <Row>
            {/* LEFT CONTENT - Slides in from the left */}
            <Col
              lg="4"
              data-aos="fade-right"
              data-aos-anchor="#why-we-section" // Trigger only when the whole section is reached
            >
              <div
                className="why-we"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="icon">
                  <FaRegMap />
                </div>
                <div>
                  <h4 className="body-font">Pan India Delivery</h4>
                  <p className="title-font">
                    We deliver our products safely and quickly across all major
                    cities and towns in India.
                  </p>
                </div>
              </div>
              <div
                className="why-we"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="icon">
                  <VscWorkspaceTrusted />
                </div>
                <div>
                  <h4 className="body-font">Secure Payment</h4>
                  <p className="title-font">
                    Enjoy safe and secure payments with trusted payment gateways
                    and multiple payment options.
                  </p>
                </div>
              </div>
              <div
                className="why-we"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="icon">
                  <FaTags />
                </div>
                <div>
                  <h4 className="body-font">Sign Up Offer</h4>
                  <p className="title-font">
                    Sign up today and get exclusive offers, discounts, and early
                    access to new products.
                  </p>
                </div>
              </div>
            </Col>

            {/* CENTER IMAGE - Stays at the same place */}
            <Col lg="4">
              <img
                src={Rectangle2}
                className="img-fluid w-100"
                alt="Piggy Bank Center"
              />
            </Col>

            {/* RIGHT CONTENT - Slides in from the right */}
            <Col lg="4" data-aos="fade-left" data-aos-anchor="#why-we-section">
              <div className="why-we" data-aos="fade-left" data-aos-delay="100">
                <div className="icon">
                  <TbCirclePercentage />
                </div>
                <div>
                  <h4 className="body-font">Top Brands</h4>
                  <p className="title-font">
                    We work with trusted and quality brands to bring you durable
                    and reliable products.
                  </p>
                </div>
              </div>
              <div className="why-we" data-aos="fade-left" data-aos-delay="200">
                <div className="icon">
                  <MdAddShoppingCart />
                </div>
                <div>
                  <h4 className="body-font">Shop with Confidence</h4>
                  <p className="title-font">
                    Shop confidently with quality assurance, easy ordering, and
                    secure checkout experience.
                  </p>
                </div>
              </div>
              <div className="why-we" data-aos="fade-left" data-aos-delay="300">
                <div className="icon">
                  <BiSupport />
                </div>
                <div>
                  <h4 className="body-font">Customer Help Desk</h4>
                  <p className="title-font">
                    Our support team is always available to help you with
                    orders, enquiries, and after-sales support.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section: Video Reels Carousel */}
      <section className="py-5 video-section overflow-hidden">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="body-font">FEATURED VIDEOS</h2>
          </div>

          {/* Use the new settings here */}
          <Slider {...videoSliderSettings}>
            {videos.map((video) => {
              const getEmbedUrl = (link) => {
                if (!link) return "";
                let videoId = "";
                if (link.includes("shorts/")) {
                  videoId = link.split("shorts/")[1]?.split("?")[0];
                } else if (link.includes("v=")) {
                  videoId = link.split("v=")[1]?.split("&")[0];
                } else if (link.includes("youtu.be/")) {
                  videoId = link.split("youtu.be/")[1]?.split("?")[0];
                }
                // Added playsinline and enablejsapi to help mobile playback stability
                return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
              };

              return (
                <div key={video.id} className="mobile-video-slide">
                  <div className="video-card shadow-sm">
                    <div className="video-responsive-container">
                      <iframe
                        src={getEmbedUrl(video.video_link)}
                        title={`Video ${video.id}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="video-hover-overlay">
                      <button
                        className="shop_now_btn_mobile"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/shop");
                        }}
                      >
                        Shop
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </Container>
      </section>

      {/* Section: Video Reels Carousel */}



      <section className="feed-back">
        <Container>
          <Row>
            <Col lg="12" className="align-content-center">
              <Testimonial />
            </Col>
          </Row>
        </Container>
      </section>
      {/* <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="align-content-center">
              <Brands />
            </Col>
          </Row>
        </Container>
      </section> */}
    </>
  );
};

export default Home;
