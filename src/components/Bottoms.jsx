import { Container, Row, Col, Nav } from "react-bootstrap";
import Forms from "./Forms";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaQuoteLeft,
} from "react-icons/fa";
import StoreLogo from "../assets/images/category/Logo2.png";
import { NavLink, useLocation } from "react-router-dom";
import UPI from "../assets/images/upi.webp";
import { useCart } from "../components/CartContext";
import { useEffect, useState } from "react";
import API_DOMAIN from "../config/config";

function Bottoms() {
  const { setShowCart } = useCart();
  const [company, setCompany] = useState(null);
  const { pathname } = useLocation();

  // 3. ADD THIS EFFECT TO HANDLE SCROLLING
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/company.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search_text: "",
          }),
        });

        const data = await response.json();
        if (data.head.code === 200 && data.body.company) {
          const targetCompany = data.body.company[0];
          setCompany(targetCompany);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);
  return (
    <>
      <section className="bottoms">
        <Container>
          <Row className="justify-content-between align-items-start">
            {/* 1. Logo and Socials - Width 3 */}
            <Col lg="3" className="py-1">
              <div className="d-flex">
                <a
                  href={company?.facebook_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={company?.instagram_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaInstagram />
                </a>
                <a
                  href={company?.youtube_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaYoutube />
                </a>
                <a
                  href={
                    company?.mobile ? `https://wa.me/${company.mobile}` : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaWhatsapp />
                </a>
              </div>
              <div className="py-1">
                <img
                  src={StoreLogo}
                  alt="Logo"
                  className="img-fluid logo"
                  style={{ maxHeight: "70px" }}
                />
              </div>
            </Col>

            {/* 2. My Accounts - Width 3 (Added ps-lg-4 for slight left spacing) */}
            <Col lg="2" className="py-1 ps-lg-4">
              <h4 className="body-font text-decoration-underline mb-1">
                My Accounts
              </h4>
              <div className="title-font">
                <Nav.Link as={NavLink} to="/home" className="py-1">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/shop" className="py-1">
                  Shop
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about" className="py-1">
                  About us
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className="py-1">
                  Contact Us
                </Nav.Link>
                <Nav.Link as={NavLink} to="/terms" className="py-1">
                  Terms and Conditions
                </Nav.Link>
              </div>
            </Col>

            {/* 3. Contact Details - Width 3 */}
            <Col lg="3" className="py-1">
              <h4 className="body-font text-decoration-underline mb-1">
                Contact Details
              </h4>
              <div className="title-font py-1" style={{ fontSize: "14px" }}>
                ADDRESS: No. 4-174B, Railway Feeder Road, Koothiyarkundu,
                Kappalur, Madurai - 625008
              </div>
              <div className="title-font py-1" style={{ fontSize: "14px" }}>
                EMAIL: saipackagingproducts@gmail.com
              </div>
            </Col>

            {/* 4. Bank Details - Width 3 */}
            <Col lg="3" className="py-1">
              <h4 className="body-font text-decoration-underline mb-1">
                Bank Details
              </h4>
              <div className="title-font py-1" style={{ fontSize: "14px" }}>
                Bank Name: TamilNad Mercantile Bank
                <br />
                A/C: 276539597167401
                <br />
                IFSC: TMBL0000276
                <br />
                Branch: Thirunagar
              </div>
            </Col>

            {/* Copyright Row - Full Width Below */}
            <Col lg="12" className="py-0 mt-0 text-center border-top mb-0">
              {" "}
              {/* Added mb-4 here */}
              <div className="title-font mt-4 mb-0">
                Copyright © 2025, mastertubes.com All Rights Reserved.
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="foot-conts">
        <Container>
          <Row>
            {/* Changed from py-1 to py-0 if you want it very thin */}
            <Col lg="12" className="py-1">
              <p className="d-flex justify-content-center mb-0 title-font text-white">
                Developed By{" "}
                <Nav.Link className="mx-2 p-0"> Zentexus Technolgies</Nav.Link>
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Bottoms;
