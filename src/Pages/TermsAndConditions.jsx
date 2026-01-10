import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TermsAndConditions = () => {
  return (
    <Container className="py-5 body-font">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="title-font mb-4 text-danger">Terms and Conditions</h1>
         
          <hr />

          <section className="mb-4">
            <h3 className="title-font">1. Order Acceptance</h3>
            <p>By placing an order on our store, you agree to the terms outlined below. All orders are subject to availability and confirmation of the order price.</p>
          </section>

          <section className="mb-4 p-4 border rounded bg-light">
            <h3 className="title-font pay">2. Payment Policy (50/50 Split)</h3>
            <p>To provide high-quality service and secure your inventory, we operate on a two-tier payment structure:</p>
            <ul>
              <li><strong>50% Advance Deposit:</strong> A non-refundable 50% deposit of the total order value is required at the time of placing the order to initiate processing.</li>
              <li><strong>50% Balance Payment:</strong> The remaining 50% balance must be cleared in full <strong>before dispatch</strong>.</li>
              <li>Goods will not be handed over to the courier service until the final payment is confirmed.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h3 className="title-font">3. Shipping and Delivery</h3>
            <p>Dispatch timelines begin only after the initial 50% deposit is received. We are not responsible for delays caused by the late payment of the remaining balance.</p>
          </section>

          <section className="mb-4">
            <h3 className="title-font">4. Cancellation Policy</h3>
            <p>Orders can only be cancelled within 24 hours of the advance payment. Since the 50% deposit is used to secure stock/manufacturing, cancellations after 24 hours will result in the forfeiture of the deposit.</p>
          </section>

          <section className="mb-4">
            <h3 className="title-font">5. Governing Law</h3>
            <p>These terms are governed by the laws of the jurisdiction in which our company is registered.</p>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsAndConditions;