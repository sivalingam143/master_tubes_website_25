import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Buttons, DoButton } from "../components/Button";
const WishList = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
                    <div className="body-font">
                        Your wishlist looks empty
                    </div>
                    <div className="my-4">
                        <Buttons label="Continue To Shopping "/>
                    </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12">
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
                      <div className="title-font cart-font">
                        7cm Green (1 Box)
                      </div>
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
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default WishList;
