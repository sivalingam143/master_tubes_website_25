import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaRegEdit } from "react-icons/fa";
import API_DOMAIN from "../config/config"; // Ensure this path is correct

const DeliveryAddress = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      setUserData(JSON.parse(storedCustomer));
    }
  }, []);

  const handleSaveAddress = async () => {
    if (!newAddress) return alert("Please enter an address");

    const payload = {
      // Required fields by your customer.php
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      email_id: userData.email_id,
      // Field to update
      delivery_address: newAddress, 
      edit_customer_id: userData.customer_id
    };

    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.head.code === 200) {
        // Update local storage and state with the new data
        localStorage.setItem("customer", JSON.stringify(result.body.customer));
        setUserData(result.body.customer);
        setShowModal(false);
        alert("Address updated successfully!");
      } else {
        alert(result.head.msg);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-capitalize">Good morning! {userData?.first_name}</h2>
      <Row className="g-3">
        <Col md={6}>
          <Card 
            className="h-100 border-dashed text-center d-flex flex-column align-items-center justify-content-center p-4 rounded-4" 
            style={{ border: '1px dashed #ddd', cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            <div className="text-danger mb-2"><FaPlusCircle size={30} /></div>
            <span className="btn btn-danger btn-sm rounded-pill px-4">Add/Change address</span>
          </Card>
        </Col>

        {userData?.delivery_address && (
          <Col md={6}>
            <Card className="h-100 p-4 rounded-4 shadow-sm border-0 position-relative">
              <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1" style={{ fontSize: '10px', borderRadius: '10px 0 10px 0' }}>
                DEFAULT
              </div>
              <div className="mt-2" style={{ fontSize: '14px' }}>
                <p className="fw-bold mb-1">{userData.first_name} {userData.last_name}</p>
                <p className="mb-0">{userData.delivery_address}</p>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Modal for adding address */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Delivery Address</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Full Address</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={newAddress} 
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="House No, Street, City, Pincode"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleSaveAddress}>Save Address</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeliveryAddress;