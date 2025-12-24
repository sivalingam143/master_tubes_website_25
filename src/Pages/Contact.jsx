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
                  <MdOutlineLocalPhone  size={25}/>
                </div>
                <div>+91 6379 28 0069</div>
                <div className="title-font">Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.</div>
              </div>
            </Col>
            <Col lg="4" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <IoHomeOutline   size={25}/>
                </div>
                <div>14/496/3, Selvavinayagar Agencies, Anuppankulam, Sivakasi - 626 189</div>
                <div className="title-font">Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.</div>
              </div>
            </Col>
            <Col lg="4" className="py-3">
              <div className="body-font text-center">
                <div className="py-3">
                  <FaRegEnvelopeOpen   size={25}/>
                </div>
                <div>sales@bigfestival.in</div>
                <div className="title-font">Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
