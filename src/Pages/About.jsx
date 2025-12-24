import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const About = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="py-5">
              <h4 className="body-font text-center">About BigFestival</h4>
            </Col>
            <Col lg="3" className="py-3">
              <div className="bg-light p-4">
                <h3 className="body-font">Wide Range</h3>
                <div className="py-2 title-font">
                  We offer a wide range of piggy banks in different designs,
                  sizes, and materials to suit kids, adults, and gifting needs.
                  From fun and colorful styles to elegant and premium designs,
                  there’s something for everyone.
                </div>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <div className="bg-light p-4">
                <h3 className="body-font">Quality & Design</h3>
                <div className="py-2 title-font">
                  Our piggy banks are crafted using quality materials with a
                  strong focus on durability and attractive design. Each product
                  is carefully finished to ensure long-lasting use and visual
                  appeal.
                </div>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <div className="bg-light p-4">
                <h3 className="body-font">Custom Orders</h3>
                <div className="py-2 title-font">
                  We support bulk and customized piggy bank orders for schools,
                  events, corporate gifting, and retailers. Custom colors,
                  logos, and designs can be created based on your requirements.
                </div>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <div className="bg-light p-4">
                <h3 className="body-font">Reliable Service</h3>
                <div className="py-2 title-font">
                  We are committed to providing reliable service with timely
                  delivery and responsive customer support. Our goal is to make
                  your shopping experience smooth, secure, and satisfying.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;
