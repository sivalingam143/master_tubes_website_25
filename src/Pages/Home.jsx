import React, { useEffect } from "react";
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
import { useCart } from "../components/CartContext";
import Brands from "../components/Brands";
const Home = () => {
  const { addToDetails } = useCart();
  const topSellProduct = {
    product_id: "top_sell_001", // Give it a unique ID
    product_name: "Royal Red Piggy Bank",
    product_price: 300,
    product_with_discount_price: 64,
    product_img_url: TopSell, // This uses the 'TopSell' image you imported at the top
  };
  useEffect(() => {
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
      <section
        id="top-selling-section"
        className="py-5 top_sell overflow-hidden"
      >
        <Container>
          <Row>
            <Col
              lg="6"
              className="text-center"
              data-aos="zoom-in"
              // This tells AOS: Don't start until the #top-selling-section is well into view
              data-aos-anchor="#top-selling-section"
            >
              <img
                src={TopSell}
                className="img-fluid w-75"
                alt="Top Selling Product"
              />
            </Col>
            <Col
              lg="6"
              className="align-content-center body-font"
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-anchor="#top-selling-section"
            >
              <h2>TOP SELLING PRODUCTS</h2>
              <h4>Royal Red Piggy Bank</h4>
              <p>
                <span className="old-price">Rs. 300.00</span>{" "}
                <span className="new-price">Rs. 64.00</span>
              </p>
              <p className="title-font">
                Start the New Year with smart savings and positive habits! This
                elegant royal red metal piggy bank is perfect for setting new
                goals and building better money habits. Strong, stylish, and
                inspiring, it’s a beautiful reminder that every coin saved
                brings you closer to your dreams.
              </p>
              {/* <button
                className="shop_now"
                onClick={() => addToDetails(topSellProduct, 1)}
              >
                Add to Cart
              </button> */}
            </Col>
          </Row>
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
