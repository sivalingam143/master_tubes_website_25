import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Forms from "../components/Forms";
import { Buttons } from "../components/Button";

const Login = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg="4">
              <div className="title-font text-center p-5">
                <h3 className="body-font">Login With OTP</h3>
                <p>Please enter your 10 digit mobile number</p>
                    <Forms PlaceHolder= "Plase Enter The 10 Digit Mobile No."/>
                    <div className="py-2">
                            <Buttons label=" Request OTP"/>
                    </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
