import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import BannerCarousel from "../components/BannerSlider";
import { Container, Row, Col } from "react-bootstrap";
import HeroCarousel from "../components/CategroySlider";
import ProductGrid from "../components/ProductGrid";
import CenterBanner from "../assets/images/home/centerbanner.webp";
import ReferBanner from "../assets/images/category/money.webp";
import home_occasion from "../assets/images/home/home_occasion.jpeg";
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
import VideoReels from "../components/VideoReels";

const Home = () => {
  const [topProducts, setTopProducts] = useState([]); // ← empty array instead of null
  const { addToDetails } = useCart();
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

  useEffect(() => {
    // Fetch Top Products
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/product.php`, {
          // ← use product.php
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_text: "" }),
        });

        const data = await response.json();

        if (data.head.code === 200) {
          // Filter only top selling products
          const filtered = data.body.products.filter(
            (p) => p.top_selling === 1
          );
          setTopProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };

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

      <section className="occasion-ad-section position-relative overflow-hidden py-5">
        <div
          className="section-bg-image"
          style={{
            backgroundImage: `url(${home_occasion})`, // Using local asset path via imported ReferBanner
          }}
        ></div>
        <div className="section-overlay"></div>{" "}
        {/* Subtle overlay for readability */}
        <Container fluid className="h-100 d-flex align-items-center px-0">
          <Row className="align-items-center g-0 h-100 w-100 m-0 justify-content-center px-2 px-lg-0">
            <Col
              lg={12}
              className="text-center p-2 p-lg-5 d-flex flex-column justify-content-center"
              data-aos="fade-up"
            >
              <div className="occasion-content shake-on-load w-100">
                <h2
                  className="display-5 fw-bold mb-3 mb-lg-5 text-white"
                  data-aos="zoom-in"
                >
                  Occasion Magic Awaits ✨
                </h2>
                <p className="lead mb-3 mb-lg-5 fs-5 text-white">
                  <strong>CUSTOMISED FOR:</strong>
                </p>
                <div className="circular-layout">
                  <div className="central-icon mb-3 mb-lg-4">🎁</div>{" "}
                  {/* Central focal point */}
                  <ul
                    className="occasion-list list-unstyled fs-5"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <li className="occasion-item" data-angle="0">
                      <span className="item-text">🎉 Birthdays</span>
                    </li>
                    <li className="occasion-item" data-angle="60">
                      <span className="item-text">💍 Valakkapu</span>
                    </li>
                    <li className="occasion-item" data-angle="120">
                      <span className="item-text">💒 Marriage Events</span>
                    </li>
                    <li className="occasion-item" data-angle="180">
                      <span className="item-text">📚 Student Savings Box</span>
                    </li>
                    <li className="occasion-item" data-angle="240">
                      <span className="item-text">🏢 Corporate Gifts</span>
                    </li>
                    <li className="occasion-item" data-angle="300">
                      <span className="item-text">🛍️ Ad & Jewellery Shop</span>
                    </li>
                  </ul>
                </div>
              </div>
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
      <section
        id="top-selling-section"
        className="py-5 top_sell overflow-hidden"
      >
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
                      <h2 className="product-title body-font">
                        {product.product_name}
                      </h2>
                      <div className="price-section mb-3">
                        <span className="old-price">
                          Rs. {product.old_price || "300.00"}
                        </span>
                        <span className="new-price ml-2">
                          Rs. {product.price || "64.00"}
                        </span>
                      </div>
                      <p className="product-description title-font">
                        {product.description ||
                          "Start the New Year with smart savings and positive habits!"}
                      </p>
                      <button
                        className="shop_now_btn body-font"
                        onClick={() => navigate(`/prdt/${product.product_id}`)}
                      >
                        Shop Now
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
      <VideoReels />

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
