import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MdOutlineLocalPhone } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
const Contact = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="py-3">
              <h3 className="body-font text-center">Connect With Us</h3>
            </Col>
            <Col lg="4" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <MdOutlineLocalPhone size={25} />
                </div>
                <div>+91 93608 26673</div>
                <div className="title-font">
                  Contact us for details about our piggy bank collections,
                  pricing, bulk orders, and customization options. Our team is
                  always ready to assist you with quick and reliable support.
                </div>
              </div>
            </Col>
            <Col lg="4" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <IoHomeOutline size={25} />
                </div>
                <div>Master Tubes,Madurai 625005,Tamilnadu ,India</div>
                <div className="title-font">
                  Our piggy banks are carefully manufactured with quality
                  materials and thoughtful designs. We ensure reliable service
                  for both retail and wholesale orders from our facility.
                </div>
              </div>
            </Col>
            <Col lg="4" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <FaRegEnvelopeOpen size={25} />
                </div>
                <div>saipackagingproducts@gmail.com</div>
                <div className="title-font">
                  Email us for piggy bank orders, custom design requests, or
                  business enquiries. We aim to respond promptly and provide the
                  best customer experience.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
