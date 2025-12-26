import React, { useState, useEffect } from "react";
import { Col, Card, Form, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    date_of_birth: "",
    gender: ""
  });

  useEffect(() => {
    // Get stored data from localStorage
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsedData = JSON.parse(storedCustomer);
      setUserData(parsedData);
    }
  }, []);

  // Helper function to split YYYY-MM-DD into DD, MM, YYYY for the inputs
  const getDobParts = () => {
    if (!userData.date_of_birth) return { day: "", month: "", year: "" };
    const [year, month, day] = userData.date_of_birth.split("-");
    return { day, month, year };
  };

  const { day, month, year } = getDobParts();

  return (
    <Col lg={12}>
      <h2 className="mb-4 text-capitalize">
        Good morning! {userData.first_name || "Guest"}
      </h2>
      <Card className="border-0 shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-end">
          <FaEdit className="text-muted cursor-pointer" />
        </div>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">First name</Form.Label>
              <Form.Control 
                type="text" 
                value={userData.first_name} 
                className="bg-light border-0" 
                readOnly 
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Last name</Form.Label>
              <Form.Control 
                type="text" 
                value={userData.last_name} 
                className="bg-light border-0" 
                readOnly 
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Email</Form.Label>
              <Form.Control 
                type="email" 
                value={userData.email_id} 
                className="bg-light border-0" 
                readOnly 
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Contact number</Form.Label>
              <Form.Control 
                type="text" 
                value={userData.phone_number} 
                className="bg-light border-0" 
                readOnly 
              />
            </Form.Group>
          </Row>

          <Form.Label className="small text-muted">Birthdate</Form.Label>
          <Row className="mb-3">
            <Col><Form.Control placeholder="DD" value={day} className="bg-light border-0" readOnly /></Col>
            <Col><Form.Control placeholder="MM" value={month} className="bg-light border-0" readOnly /></Col>
            <Col><Form.Control placeholder="YYYY" value={year} className="bg-light border-0" readOnly /></Col>
          </Row>

          <Form.Group>
            <Form.Label className="small text-muted d-block">Gender</Form.Label>
            <Form.Check 
              inline 
              label="Male" 
              name="gender" 
              type="radio" 
              checked={userData.gender === "Male"} 
              disabled 
            />
            <Form.Check 
              inline 
              label="Female" 
              name="gender" 
              type="radio" 
              checked={userData.gender === "Female"} 
              disabled 
            />
            <Form.Check 
              inline 
              label="Other" 
              name="gender" 
              type="radio" 
              checked={userData.gender === "Other"} 
              disabled 
            />
          </Form.Group>
        </Form>
      </Card>
    </Col>
  );
};

export default Profile;