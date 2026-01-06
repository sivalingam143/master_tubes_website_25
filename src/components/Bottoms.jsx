import { Container, Row, Col, Nav } from "react-bootstrap";
import Forms from "./Forms";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import StoreLogo from "../assets/images/category/Logo2.png";
import { NavLink , useLocation} from "react-router-dom";
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
            <Col lg="3" className="py-3">
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

              <div className="py-3">
                <img src={StoreLogo} alt="Logo" className="img-fluid logo" />
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <h6 className="body-font text-decoration-underline">My Accounts</h6>
              <div className="title-font">
                <Nav.Link as={NavLink} to="/shop" className="py-2">
                  Shop
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about" className="py-2">
                  About us
                </Nav.Link>

                <Nav.Link as={NavLink} to="/contact" className="py-2">
                  Contact Us
                </Nav.Link>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <h6 className="body-font text-decoration-underline">Customer Service</h6>
              <div className="title-font">
                <Nav.Link as={NavLink} to="/profile" className="py-2">
                  {" "}
                  My Account
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile/orders" className="py-2">
                  Order History{" "}
                </Nav.Link>
                <Nav.Link
                  className="py-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowCart(true)}
                >
                  Shopping cart
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile/wishlist" className="py-2">
                  {" "}
                  Wishing Cart
                </Nav.Link>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <h6 className="body-font text-decoration-underline">Contact Details</h6>
              <div className="title-font py-2">
                ADDRESS: Master Tubes,Madurai 625005,Tamilnadu ,India
              </div>
              <div className="title-font py-2">
                EMAIL: saipackagingproducts@gmail.com
              </div>
            </Col>
            <Col lg="6" className="py-4">
              <div className="title-font">
                Copyright © 2025, mastertubes.com All Rights Reserved.
              </div>
            </Col>
            <Col lg="6" className="py-4 text-lg-end text-left">
              {/* <div className="upi">
                {" "}
                <img src={UPI} alt="Logo" className="img-fluid logo" />
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>
      <section className="foot-conts">
        <Container>
          <Row>
            <Col lg="12" className="py-1">
              <p className="d-flex justify-content-center mb-0 title-font text-white">
                Developed By <Nav.Link className="mx-2"> Zentexus Technolgies</Nav.Link>
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Bottoms;
