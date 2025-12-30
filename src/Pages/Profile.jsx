import React, { useState, useEffect } from "react";
import { Col, Card, Form, Row, Button, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import API_DOMAIN from "../config/config";
import { toast } from "react-toastify";
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
      // PREVENT DEPRECATION ERROR: 
      // Ensure phone_number is sent as a string to satisfy PHP's ctype_digit
      const payload = {
        ...userData,
        phone_number: userData.phone_number ? String(userData.phone_number) : "",
        edit_customer_id: userData.customer_id, 
      };

      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
     if (result.head.code === 200) {
  setIsEditing(false);
  setUserData(result.body.customer);
  localStorage.setItem("customer", JSON.stringify(result.body.customer));
  toast.success("Profile updated successfully!");
} else {
  toast.error(result.head.msg || "Failed to update profile.");
}
    } catch (error) {
      console.error("Save error:", error);
    // In the catch block
toast.error("Failed to save changes. Please try again.");
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
    className="bg-light border-0"
    readOnly={true}                    // Always non-editable
    // Optionally add disabled to gray it out consistently
    disabled={true}
    // No onChange handler → prevents state updates
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

          {isEditing && (
            <div className="mt-4">
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className=" save px-1 py-2"
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Save Changes"}
              </Button>
              <Button 
                // variant="link" 
                className=" ms-3 cancel " 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </Form>
      </Card>
    </Col>
  );
};

export default Profile;