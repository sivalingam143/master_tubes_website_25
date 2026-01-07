import { Container, Row, Col, Nav } from "react-bootstrap";
import Forms from "./Forms";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp, FaQuoteLeft,
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
            search_text: ""
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
          <Row>
            {/* Reduced py-3/4 to py-1 or py-2 throughout */}
            <Col lg="4" className="py-1">
              <div className="d-flex">
                {/* Facebook */}
                <a
                  href={company?.facebook_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaFacebookF />
                </a>

                {/* Instagram */}
                <a
                  href={company?.instagram_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaInstagram />
                </a>

                {/* Youtube */}
                <a
                  href={company?.youtube_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaYoutube />
                </a>

                {/* WhatsApp - Use the mobile number from DB if no link is provided */}
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

              <div className="py-1"> {/* Reduced from py-3 */}
                <img src={StoreLogo} alt="Logo" className="img-fluid logo" style={{ maxHeight: '70px' }} />
              </div>
            </Col>

            <Col lg="4" className="py-1"> {/* Reduced from py-3 */}
              <h4 className="body-font text-decoration-underline mb-1">My Accounts</h4>
              <div className="title-font">
                <Nav.Link as={NavLink} to="/home" className="py-1">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/shop" className="py-1">Shop</Nav.Link>
                <Nav.Link as={NavLink} to="/about" className="py-1">About us</Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className="py-1">Contact Us</Nav.Link>
              </div>
            </Col>

            <Col lg="4" className="py-1"> {/* Reduced from py-3 */}
              <h4 className="body-font text-decoration-underline mb-1">Contact Details</h4>
              <div className="title-font py-1">
                ADDRESS: Master Tubes, Madurai 625005, Tamilnadu, India
              </div>
              <div className="title-font py-1">
                EMAIL: saipackagingproducts@gmail.com
              </div>
            </Col>

            <Col lg="6" className="py-2"> {/* Reduced from py-4 */}
              <div className="title-font">
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
                Developed By <Nav.Link className="mx-2 p-0"> Zentexus Technolgies</Nav.Link>
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Bottoms;
