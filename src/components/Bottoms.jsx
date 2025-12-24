import { Container, Row, Col, Nav } from "react-bootstrap";
import Forms from "./Forms";
import { FaFacebookF,FaInstagram,FaYoutube,FaWhatsapp   } from "react-icons/fa";
import StoreLogo from "../assets/images/Logo_1.avif";
import UPI from '../assets/images/upi.webp'
function Bottoms() {


  return (
    <>
    <section className="bottoms">
        <Container>
            <Row>
                <Col lg='3' className="py-3">
                    <h6 className="body-font">Subscribe To Receive Updates, Access To Exclusive Deals, And More.</h6>
                    <div className="py-2">
                       <Forms PlaceHolder="Search Products" />
                    </div>
                    <div className="d-flex">
                            <div className="social-icon"><FaFacebookF/></div>
                            <div className="social-icon"><FaInstagram/></div>
                            <div className="social-icon"><FaYoutube /></div>
                            <div className="social-icon"><FaWhatsapp/></div>
                    </div>
                    <div className="py-3">
                          <img src={StoreLogo} alt="Logo" className="img-fluid logo" />
                    </div>
                </Col>
                <Col lg='3' className="py-3">
                    <h6 className="body-font">My Accounts</h6>
                    <div className="title-font">
                        <Nav.Link className="py-2"> Shop</Nav.Link>  
                        <Nav.Link className="py-2"> About us </Nav.Link>  
                        <Nav.Link className="py-2"> Blog</Nav.Link>  
                        <Nav.Link className="py-2"> FAQ</Nav.Link>  
                        <Nav.Link className="py-2"> Contact Us</Nav.Link>  
                    </div> 
                </Col>
                <Col lg='3' className="py-3">
                    <h6 className="body-font">Customer Service</h6>
                    <div className="title-font">
                        <Nav.Link className="py-2"> My  Account</Nav.Link>  
                        <Nav.Link className="py-2">Order History </Nav.Link>  
                        <Nav.Link className="py-2"> Shopping cart</Nav.Link>  
                        <Nav.Link className="py-2"> Wishing Cart</Nav.Link>  
                    </div> 
                </Col>
                <Col lg='3' className="py-3">
                    <h6 className="body-font">Contact Details</h6>
                    <div className="title-font py-2">
                      ADDRESS: 14/496/3, Selvavinayagar Agencies, Anuppankulam,  <br/>Sivakasi - 626 189 
                    </div> 
                    <div className="title-font py-2">
                     EMAIL: sales@bigfestival.in 
                    </div> 
                </Col>
                <Col lg= '6' className="py-4">
                    <div className="title-font">Copyright © 2025, bigfestival.online All Rights Reserved.</div>
                </Col>
                <Col lg= '6' className="py-4 text-lg-end text-left">
                   <div className="upi">   <img src={UPI} alt="Logo" className="img-fluid logo" /></div>
                </Col>
            </Row>
        </Container>
    </section>
    <section className="foot-conts">
        <Container>
            <Row>
                <Col lg='12' className="py-1">
                <p className="d-flex justify-content-center mb-0 title-font text-white">Developed By  <Nav.Link className="mx-2">  Zentexus</Nav.Link></p>
                    
                </Col>
            </Row>
        </Container>
    </section>
    </>
  );
}

export default Bottoms;
