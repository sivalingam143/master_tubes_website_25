import React, { useState, useEffect } from "react";
import { Col, Card, Form, Row, Button, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import API_DOMAIN from "../config/config";

const Profile = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!localStorage.getItem("customer");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const storedAuth = JSON.parse(localStorage.getItem("customer"));
    const customerId = storedAuth?.customer_id;

    if (customerId) {
      try {
        const response = await fetch(`${API_DOMAIN}/customer.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_profile",
            customer_id: customerId,
          }),
        });
        const result = await response.json();
        if (result.head.code === 200) {
          setUserData(result.body.customer);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          edit_customer_id: userData.customer_id, // Triggers update in PHP
        }),
      });

      const result = await response.json();
      if (result.head.code === 200) {
        setIsEditing(false);
        setUserData(result.body.customer);
        localStorage.setItem("customer", JSON.stringify(result.body.customer));
        alert("Profile updated successfully!");
      } else {
        alert("Error: " + result.head.msg);
      }
    } catch (error) {
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <Col lg={12}>
      <h2 className="mb-4 text-capitalize">
        Good morning! {userData.first_name || "Guest"}
      </h2>
      
      <Card className="border-0 shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-end mb-2">
          {!isEditing && (
            <FaEdit 
              className="text-muted cursor-pointer" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setIsEditing(true)} 
            />
          )}
        </div>
        
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">First name</Form.Label>
              <Form.Control
                name="first_name"
                type="text"
                value={userData.first_name || ""}
                onChange={handleInputChange}
                className={isEditing ? "border" : "bg-light border-0"}
                readOnly={!isEditing}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Last name</Form.Label>
              <Form.Control
                name="last_name"
                type="text"
                value={userData.last_name || ""}
                onChange={handleInputChange}
                className={isEditing ? "border" : "bg-light border-0"}
                readOnly={!isEditing}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Email</Form.Label>
              <Form.Control
                name="email_id"
                type="email"
                value={userData.email_id || ""}
                onChange={handleInputChange}
                className={isEditing ? "border" : "bg-light border-0"}
                readOnly={!isEditing}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="small text-muted">Contact number</Form.Label>
              <Form.Control
                name="phone_number"
                type="text"
                value={userData.phone_number || ""}
                onChange={handleInputChange}
                className={isEditing ? "border" : "bg-light border-0"}
                readOnly={!isEditing}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Birthdate</Form.Label>
            <Form.Control
              name="date_of_birth"
              type="date"
              value={userData.date_of_birth || ""}
              onChange={handleInputChange}
              className={isEditing ? "border" : "bg-light border-0"}
              readOnly={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small text-muted d-block">Gender</Form.Label>
            {["Male", "Female", "Other"].map((g) => (
              <Form.Check
                key={g}
                inline
                label={g}
                name="gender"
                type="radio"
                value={g}
                checked={userData.gender === g}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            ))}
          </Form.Group>

          {/* Save and Cancel Buttons positioned after Gender */}
          {isEditing && (
            <div className="mt-4">
             <Button 
  onClick={handleSave} 
  disabled={loading}
  className=" save border-0 px-3 py-2 "
  
>
  {loading ? <Spinner size="sm" animation="border" /> : "Save"}
</Button>
             
            </div>
          )}
        </Form>
      </Card>
    </Col>
  );
};

export default Profile;