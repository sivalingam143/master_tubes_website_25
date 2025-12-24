import React from "react";
import BannerCarousel from "../components/BannerSlider";
import { Container, Row, Col } from "react-bootstrap";
import HeroCarousel from "../components/CategroySlider";
import ProductGrid from "../components/ProductGrid";
import CenterBanner from "../assets/images/home/centerbanner.webp";
import ReferBanner from "../assets/images/home/spyder.webp";
import Occasion from "../components/Occasion";
import TopSell from "../assets/images/home/fancy.webp";
import Selling from '../assets/images/home/EarlyCrackers.webp';
import Rectangle from '../assets/images/home/Rectangle.webp';
import { FaRegMap,FaTags  } from "react-icons/fa";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { TbCirclePercentage } from "react-icons/tb";
import { MdAddShoppingCart } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Testimonial from "../components/Testimonial";
import Brands from "../components/Brands";
const Home = () => {
  return (
    <>
      {/* banner start */}
      <BannerCarousel />
      {/* banner end */}

      {/* categrory section start */}
      <section className="category-bg">
        <Container className="py-5">
          <Row>
            <Col lg="12">
              <div className="text-center body-font">Shop By Categrory</div>
            </Col>
            <Col lg="12">
              <HeroCarousel />
            </Col>
          </Row>
        </Container>
      </section>
      {/* categrory section end */}
      {/* categrory section start */}
      <section className="product-grids">
        <Container className="py-5">
          <Row>
            <Col lg="12" className="py-5 mb-5 mx-auto">
              <div className="d-flex justify-content-center">
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
      <section className="photo-grids">
        <Container fluid className="px-0">
          <Row>
            <Col lg="12">
              <img src={CenterBanner} className="img-fluid w-100" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="">
        <Container fluid>
          <Row>
            <Col lg="6" className="p-5 align-content-center">
              <div>
                <h2 className="body-font">
                  Refer bigfestival.in to your friends
                </h2>
                <p className="title-font">
                  Refer bigfestival.in to your friends get Rs.100 added to your
                  wallet on their first purchase and Rs.50 will be added in
                  their account too.
                </p>
                <div>
                  {" "}
                  <button className="shop_now body-font">Shop Now</button>
                </div>
              </div>
            </Col>
            <Col lg="6" className="p-0">
              <img src={ReferBanner} className="img-fluid w-100" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5 occasion">
        <Container fluid>
          <Row>
            <Col lg="12 ">
              <h3 className="pb-5 text-center body-font">Shop By Occasion</h3>
              <Occasion />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5 top_sell">
        <Container>
          <Row>
            <Col lg="6 text-center">
              <img src={TopSell} className="img-fluid w-75" />
            </Col>
            <Col lg="6 align-content-center body-font">
              <h2>TOP SELLING PRODUCTS</h2>
              <h4>Levis - 3" Aerial Shorts</h4>
              <p>
                <span className="old-price">Rs. 300.00</span>{" "}
                <span className="new-price">Rs. 64.00</span>
              </p>
              <p className="title-font">Illuminate your Diwali celebrations with our 3-inch aerial shots! Experience a visual delight with sharp, bright sparks that fill the night sky. Elevate your festivities with our premium fireworks crackers—a dazzling celebration essential!</p>
              <button className="shop_now">Add to Cart</button>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <Container fluid className="px-0">
          <Row>
            <Col lg='12'>
              <img src={Selling} className="img-fluid w-100" />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg='4' className="align-content-center py-5 text-lg-end text-left">
               <div className="why-we ">
                    <div className="icon"><FaRegMap/></div>
                    <div >
                      <h4 className="body-font">Pan India Delivery</h4>
                      <p className="title-font">Short supporting line goes here.</p>
                    </div>
               </div>
               <div className="why-we">
                    <div className="icon"><VscWorkspaceTrusted/></div>
                    <div >
                      <h4 className="body-font">Secure Payment</h4>
                      <p className="title-font">Short supporting line goes here</p>
                    </div>
               </div>
               <div className="why-we">
                    <div className="icon"><FaTags/></div>
                    <div >
                      <h4 className="body-font">Sign Up Offer</h4>
                      <p className="title-font">Short supporting line goes here.</p>
                    </div>
               </div>
            </Col>
            <Col lg='4'>
                <img src={Rectangle} className="img-fluid w-100" />
            </Col>
            <Col lg='4' className="align-content-center py-5 ">
               <div className="why-we ">
                    <div className="icon"><TbCirclePercentage/></div>
                    <div >
                      <h4 className="body-font">Top Brands</h4>
                      <p className="title-font">Short supporting line goes here.</p>
                    </div>
               </div>
               <div className="why-we">
                    <div className="icon"><MdAddShoppingCart/></div>
                    <div >
                      <h4 className="body-font">Shop with Confidence</h4>
                      <p className="title-font">Short supporting line goes here.</p>
                    </div>
               </div>
               <div className="why-we">
                    <div className="icon"><BiSupport/></div>
                    <div >
                      <h4 className="body-font">Customer Help Desk</h4>
                      <p className="title-font">Short supporting line goes here.</p>
                    </div>
               </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="feed-back">
          <Container>
            <Row>
              <Col lg='12' className="align-content-center">
                <Testimonial/>
              </Col>
            </Row>
          </Container>
      </section>
      <section className="py-5">
          <Container>
            <Row>
              <Col lg='12' className="align-content-center">
                <Brands/>
              </Col>
            </Row>
          </Container>
      </section>
    </>
  );
};

export default Home;
