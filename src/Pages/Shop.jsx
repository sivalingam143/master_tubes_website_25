import React, { useState } from "react";
import { Buttons, DoButton } from "../components/Button";
import { IoFilter } from "react-icons/io5";
import { Container, Row, Col, Offcanvas, Table } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Forms from "../components/Forms";
import Cm from '../assets/images/shop/7cm.webp'
import { useNavigate } from "react-router-dom";
const Shop = () => {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
   const handleDeatiledProduct = () => {
    navigate("/prdt");
  };
  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="6" className="py-2">
              <Forms
                type="select"
                multiple={true}
                options={[
                  { label: "Electronics", value: "electronics" },
                  { label: "Fashion", value: "fashion" },
                  { label: "Home Appliances", value: "home" },
                ]}
              />
            </Col>
            <Col lg="6" className="py-2">
              <Forms PlaceHolder="Search" />
            </Col>
            <Col lg="12">
              <Buttons
                label={
                  <>
                    <IoFilter className="me-2" />
                    Cart
                  </>
                }
                onClick={() => setShowFilter(true)}
              />
            </Col>
            <Col lg="12" className="py-3">
                <div className="category-title body-font"> Ground Chakkar</div>
            </Col>
            <Col lg="3" className="product-box" onClick={handleDeatiledProduct}>
            <div className="img-content">
                <img src={Cm}  className="img-fluid"/>
            </div>
            <div className="product-content">
                <div className="body-font py-3">7 CM Electric (Box)</div>
                <div className="price-content title-font">
                    <div className="net-price mx-2"> RS . 150</div>
                    <div className="discounted_price mx-2"> RS.15</div>
                </div>
                <div className="pt-3">
                    <DoButton/>
                </div>
            </div>
                    
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= FILTER OFFCANVAS ================= */}
      <Offcanvas
        show={showFilter}
        onHide={() => setShowFilter(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Products</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Table>
            <thead>
              <tr>
                <td>Products</td>
                <td>Price</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="title-font cart-font">7cm Green (1 Box)</div>
                  <div className="cart-font body-font ">
                    {" "}
                    <span className="discount_price">Rs. 19.50</span>{" "}
                    <span className="mx-2">Rs. 18.53</span>
                  </div>
                  <DoButton />
                </td>
                <td>
                  <div className="cart-font body-font w-100">
                    {" "}
                    <div className="discount_price">Rs. 19.50</div>{" "}
                    <div>Rs. 18.53</div>
                  </div>
                </td>
                <td>
                  <div className="cart-font text-center">
                    <MdOutlineDeleteOutline />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Shop;
