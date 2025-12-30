import React from "react";
import { Col, Container, Row } from "react-bootstrap";
// Added missing icon imports
import { MdOutlineLocalPhone } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegEnvelopeOpen } from "react-icons/fa6";

const About = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          {/* Main About Section */}
          <Row>
            <Col lg="12" className="py-5">
              <h4 className="body-font text-center">About Master Tubes</h4>
            </Col>
            <Col lg="3" md="6" className="py-3">
              <div className="bg-light p-4 h-100 shadow-sm">
                <h3 className="body-font">Wide Range</h3>
                <div className="py-2 title-font">
                  We offer a wide range of piggy banks in different designs,
                  sizes, and materials to suit kids, adults, and gifting needs.
                   From fun and colorful styles to elegant and premium designs,
                  there’s something for everyone.
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" className="py-3">
              <div className="bg-light p-4 h-100 shadow-sm">
                <h3 className="body-font">Quality & Design</h3>
                <div className="py-2 title-font">
                  Our piggy banks are crafted using quality materials with a
                  strong focus on durability and attractive design. Each product
                  is carefully finished to ensure long-lasting use and visual
                  appeal.
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" className="py-3">
              <div className="bg-light p-4 h-100 shadow-sm">
                <h3 className="body-font">Custom Orders</h3>
                <div className="py-2 title-font">
                  We support bulk and customized piggy bank orders for schools,
                  events, corporate gifting, and retailers.Custom colors,
                  logos, and designs can be created based on your requirements.
                </div>
              </div>
            </Col>
            <Col lg="3" md="6" className="py-3">
              <div className="bg-light p-4 h-100 shadow-sm">
                <h3 className="body-font">Reliable Service</h3>
                <div className="py-2 title-font">
                  We are committed to providing reliable service with timely
                  delivery and responsive customer support.Our goal is to make
                  your shopping experience smooth, secure, and satisfying.
                </div>
              </div>
            </Col>
          </Row>

          {/* New Connect With Us Row */}
          <Row className="mt-5">
            <Col lg="12" className="py-3">
              <h3 className="body-font text-center">Connect With Us</h3>
            </Col>
            <Col lg="4" md="6" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <MdOutlineLocalPhone size={25} />
                </div>
                <div className="fw-bold">+91 93608 26673</div>
                <div className="title-font mt-2">
                  Contact us for details about our piggy bank collections,
                  pricing, bulk orders, and customization options.
                </div>
              </div>
            </Col>
            <Col lg="4" md="6" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <IoHomeOutline size={25} />
                </div>
                <div className="fw-bold">Master Tubes, Madurai 625005, Tamilnadu, India</div>
                <div className="title-font mt-2">
                  Our piggy banks are carefully manufactured with quality
                  materials and thoughtful designs.
                </div>
              </div>
            </Col>
            <Col lg="4" md="12" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <FaRegEnvelopeOpen size={25} />
                </div>
                <div className="fw-bold">saipackagingproducts@gmail.com</div>
                <div className="title-font mt-2">
                  Email us for piggy bank orders, custom design requests, or
                  business enquiries.
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