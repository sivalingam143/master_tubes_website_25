import React, { useState } from "react";
import { Container, Card, Nav, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Account = () => {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Navigation Headers */}
      <Nav className="justify-content-center mb-4 border-bottom pb-2">
        <Nav.Link as={NavLink} to="/account" className="text-dark border-bottom border-dark border-2 fw-bold">My Account</Nav.Link>
        <Nav.Link as={NavLink} to="/orders" className="text-muted">Order History</Nav.Link>
        <Nav.Link as={NavLink} to="/cart" className="text-muted">Shopping Cart</Nav.Link>
        <Nav.Link as={NavLink} to="/wishlist" className="text-muted">Wishlist Cart</Nav.Link>
      </Nav>

      <h2 className="fw-bold mb-4">Profile</h2>

      {/* Profile Card */}
      <Card className="mb-4 border shadow-sm rounded-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Name</span>
            <FaEdit className="text-muted" style={{ cursor: "pointer" }} />
          </div>
          <p className="fw-bold mb-3">sathiya priya</p>
          <span className="text-muted small d-block">Email</span>
          <p className="mb-0">psanjaykuma77@gmail.com</p>
        </Card.Body>
      </Card>

      {/* Address Card with +Add trigger */}
      <Card className="border shadow-sm rounded-3">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">
              Addresses 
              <span 
                className="text-primary ms-2" 
                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                onClick={handleShow} // Opens the Modal
              >
                + Add
              </span>
            </h6>
          </div>
          <div className="bg-light p-3 rounded-2 border d-flex align-items-center text-muted">
            <FaInfoCircle className="me-2" />
            No addresses added
          </div>
        </Card.Body>
      </Card>

      {/* Add Address Modal Popup */}
      <Modal show={showModal} onHide={handleClose} centered size="sm">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Add address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="This is my default address" className="small" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">Country/region</Form.Label>
              <Form.Select>
                <option>India</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Control placeholder="First name" />
              </Col>
              <Col md={6}>
                <Form.Control placeholder="Last name" />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control placeholder="Address" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control placeholder="Apartment, suite, etc. (optional)" />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}><Form.Control placeholder="City" /></Col>
              <Col md={4}>
                <Form.Select>
                  <option>State</option>
                  <option>Andaman and Nicobar Islands</option>
                </Form.Select>
              </Col>
              <Col md={4}><Form.Control placeholder="PIN code" /></Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control placeholder="Phone" defaultValue="+91" />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="link" onClick={handleClose} className="text-decoration-none text-dark">
                Cancel
              </Button>
              <Button variant="danger" className="px-4" onClick={handleClose}>
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Account;