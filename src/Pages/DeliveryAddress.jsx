import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import API_DOMAIN from "../config/config";

const DeliveryAddress = () => {
  const [userData, setUserData] = useState(null);
  console.log("userData", userData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    zipCode: "",
    company: "",
    contactNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProfile = async (customerId) => {
    try {
      const res = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST", // Backend expects POST for json_decode
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_profile",
          customer_id: customerId,
        }),
      });
      const result = await res.json();
      if (result.head.code === 200) {
        setUserData(result.body.customer); // This will now set userData correctly
        localStorage.setItem("customer", JSON.stringify(result.body.customer));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsed = JSON.parse(storedCustomer);
      fetchProfile(parsed.customer_id);
    } else {
      setLoading(false);
    }
  }, []);

  const handleSaveAddress = async () => {
    console.log("address");
    if (!userData) return;

    // 1. Group address fields into an object (to be stored as a JSON array/string)
    const addressData = {
      firstName: addressForm.firstName,
      lastName: addressForm.lastName,
      address1: addressForm.address1,
      address2: addressForm.address2,
      city: addressForm.city,
      zipCode: addressForm.zipCode,
      company: addressForm.company,
      contactNumber: addressForm.contactNumber,
      country: "India", // Based on your UI screenshot
    };

    console.log("addressData",addressData)
    // if (!addressForm.address1 || !addressForm.city) {
    //   alert("Please fill in Address and City");
    //   return;
    // }

    // 2. Construct the payload with only the essential identifying info
    const payload = {
      action: "update_address", // Required to prevent Parameter Mismatch
      edit_customer_id: userData.customer_id,
      // Convert the object to a string for the longtext DB column
      delivery_address: JSON.stringify(addressData),
    };

    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.head.code === 200) {
        alert("Address updated successfully!");
        setIsEditing(false);
        fetchProfile(userData.customer_id);
      } else {
        alert("Error: " + result.head.msg);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // NEW: Supports both JSON (new) and old comma format (for backward compatibility)
  const parseAddressForEditing = (deliveryAddress) => {
    let parsed = {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      zipCode: "",
      company: "",
      contactNumber: "",
    };

    if (deliveryAddress) {
      try {
        // Try to parse as JSON first (new format)
        const jsonData = JSON.parse(deliveryAddress);
        parsed = { ...parsed, ...jsonData };
      } catch (e) {
        // Fallback to old comma-separated format
        const fields = deliveryAddress.split(", ");
        fields.forEach((field) => {
          if (field.startsWith("Firstname "))
            parsed.firstName = field.replace("Firstname ", "");
          if (field.startsWith("Lastname "))
            parsed.lastName = field.replace("Lastname ", "");
          if (field.startsWith("Address1 "))
            parsed.address1 = field.replace("Address1 ", "");
          if (field.startsWith("Address2 "))
            parsed.address2 = field.replace("Address2 ", "");
          if (field.startsWith("City "))
            parsed.city = field.replace("City ", "");
          if (field.startsWith("Zip "))
            parsed.zipCode = field.replace("Zip ", "");
          if (field.startsWith("Company "))
            parsed.company = field.replace("Company ", "");
          if (field.startsWith("Contact "))
            parsed.contactNumber = field.replace("Contact ", "");
        });
      }
    }

    setAddressForm(parsed);
    setIsEditing(true);
  };

  // NEW: Display function that understands JSON
  const getField = (key) => {
    if (!userData?.delivery_address) return "";

    let parsed = null;
    try {
      parsed = JSON.parse(userData.delivery_address);
    } catch (e) {
      // Old format fallback
      const fields = userData.delivery_address.split(", ");
      const oldMap = {
        firstName: "Firstname",
        lastName: "Lastname",
        address1: "Address1",
        address2: "Address2",
        city: "City",
        zipCode: "Zip",
        company: "Company",
        contactNumber: "Contact",
      };
      const match = fields.find((f) => f.startsWith(oldMap[key] + " "));
      return match ? match.replace(oldMap[key] + " ", "") : "";
    }

    // New JSON format
    switch (key) {
      case "firstName":
        return parsed.firstName || "";
      case "lastName":
        return parsed.lastName || "";
      case "address1":
        return parsed.address1 || "";
      case "address2":
        return parsed.address2 || "";
      case "city":
        return parsed.city || "";
      case "zipCode":
        return parsed.zipCode || "";
      case "company":
        return parsed.company || "";
      case "contactNumber":
        return parsed.contactNumber || "";
      default:
        return "";
    }
  };

  const renderAddressForm = () => (
    <Card
      className="shadow-sm border-0 rounded-4 p-4 mx-auto mt-4"
      style={{ maxWidth: "900px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5
          className="m-0 w-100 text-center fw-normal"
          style={{ fontSize: "1.25rem" }}
        >
          Delivery address
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setIsEditing(false)}
        ></button>
      </div>
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="small text-muted">First name</Form.Label>
            <Form.Control
              name="firstName"
              value={addressForm.firstName}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="small text-muted">Last name</Form.Label>
            <Form.Control
              name="lastName"
              value={addressForm.lastName}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="small text-muted">Address line 1</Form.Label>
            <Form.Control
              name="address1"
              value={addressForm.address1}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="small text-muted">Address line 2</Form.Label>
            <Form.Control
              name="address2"
              value={addressForm.address2}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label className="small text-muted">Company</Form.Label>
            <Form.Control
              name="company"
              value={addressForm.company}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-muted">
              Postal/Zip Code
            </Form.Label>
            <Form.Control
              name="zipCode"
              value={addressForm.zipCode}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-muted">Contact number</Form.Label>
            <div
              className="d-flex align-items-center px-2"
              style={{
                backgroundColor: "#eff2f7",
                borderRadius: "5px",
                height: "45px",
              }}
            >
              <span className="me-2 small">+91</span>
              <Form.Control
                name="contactNumber"
                value={addressForm.contactNumber}
                onChange={handleInputChange}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label className="small text-muted">City</Form.Label>
            <Form.Control
              name="city"
              value={addressForm.city}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="small text-muted">Country</Form.Label>
            <Form.Select
              style={{
                backgroundColor: "#eff2f7",
                border: "none",
                height: "45px",
              }}
            >
              <option>India</option>
            </Form.Select>
          </Col>
        </Row>
        <div className="text-end mt-4">
          <Button
            variant="danger"
            className="px-5 py-2 fw-bold"
            onClick={handleSaveAddress}
            style={{ borderRadius: "8px", minWidth: "150px" }}
          >
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );

  const renderSavedAddressCard = () => (
    <Card
      className="shadow-sm border-0 rounded-4 p-4 mx-auto mt-4"
      style={{ maxWidth: "900px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5
          className="m-0 w-100 text-center fw-normal"
          style={{ fontSize: "1.25rem" }}
        >
          Delivery address
        </h5>
        <div className="d-flex align-items-center">
          <FaEdit
            className="me-3 text-muted"
            style={{ cursor: "pointer" }}
            onClick={() => parseAddressForEditing(userData.delivery_address)}
            size={20}
          />
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              const updated = { ...userData, delivery_address: "" };
              setUserData(updated);
              localStorage.setItem("customer", JSON.stringify(updated));
            }}
          ></button>
        </div>
      </div>
      <div className="px-2">
        <Row className="mb-3">
          <Col md={6}>
            <label className="small text-muted d-block">First name</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("firstName")}
            </div>
          </Col>
          <Col md={6}>
            <label className="small text-muted d-block">Last name</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("lastName")}
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <label className="small text-muted d-block">Address Line 1</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("address1")}
            </div>
          </Col>
          <Col md={6}>
            <label className="small text-muted d-block">Address Line 2</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("address2")}
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <label className="small text-muted d-block">Company</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("company")}
            </div>
          </Col>
          <Col md={4}>
            <label className="small text-muted d-block">City</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("city")}
            </div>
          </Col>
          <Col md={4}>
            <label className="small text-muted d-block">Zip Code</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getField("zipCode")}
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <label className="small text-muted d-block">Contact Number</label>
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: "#eff2f7",
                height: "45px",
                display: "flex",
                alignItems: "center",
              }}
            >
              +91 {getField("contactNumber")}
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-capitalize text-center">Account Details</h2>
      {isEditing ? (
        renderAddressForm()
      ) : userData?.delivery_address ? (
        renderSavedAddressCard()
      ) : (
        <div className="text-center p-5">
          <Card
            className="mx-auto border-dashed d-flex flex-column align-items-center justify-content-center p-4 rounded-4 bg-danger text-white shadow"
            style={{
              border: "1px dashed #fff",
              cursor: "pointer",
              maxWidth: "400px",
            }}
            onClick={() => {
              setAddressForm({
                firstName: "",
                lastName: "",
                address1: "",
                address2: "",
                city: "",
                zipCode: "",
                company: "",
                contactNumber: "",
              });
              setIsEditing(true);
            }}
          >
            <div className="text-white mb-2">
              <FaPlusCircle size={30} />
            </div>
            <span className="btn btn-light btn-sm rounded-pill px-4 text-danger fw-bold">
              Add address
            </span>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
