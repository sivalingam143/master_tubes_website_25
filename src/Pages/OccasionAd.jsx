import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./OccasionAd.css";

const OccasionAd = ({ bgImage }) => {
  return (
    <section className="occasion-ad-section position-relative overflow-hidden py-5">
      <div
        className="section-bg-image"
        style={{
          backgroundImage: `url(${bgImage})`,
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
            <div className="occasion-content w-100">
              <h2
                className="display-3 fw-light mb-4 mb-lg-5 text-white"
                data-aos="zoom-in"
              >
                Occasion <span className="magic-text">Magic Awaits</span>
              </h2>
              <p className="lead mb-4 mb-lg-5 customised-for">
                CUSTOMISED FOR:
              </p>
              <div className="circular-layout">
                <div className="central-icon">🎁</div>{" "}
                {/* Central focal point */}
                <ul
                  className="occasion-list list-unstyled"
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
  );
};

export default OccasionAd;
