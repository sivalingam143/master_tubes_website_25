import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import API_DOMAIN from "../config/config";

const DeliveryAddress = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    company: "",
    zipCode: "",
    contactNumber: "",
    city: "",
    country: "India"
  });

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsed = JSON.parse(storedCustomer);
      setUserData(parsed);
    }
  }, []);

  const parseAddressForEditing = (addressString) => {
    if (!addressString) return;
    const fields = addressString.split(", ");
    const newForm = { ...addressForm };
    fields.forEach(field => {
      const [label, value] = field.split(". ");
      if (!value) return;
      if (label === "Firstname") newForm.firstName = value;
      if (label === "Lastname") newForm.lastName = value;
      if (label === "Address1") newForm.address1 = value;
      if (label === "Address2") newForm.address2 = value;
      if (label === "City") newForm.city = value;
      if (label === "Zip") newForm.zipCode = value;
      if (label === "Company") newForm.company = value;
      if (label === "Contact") newForm.contactNumber = value;
    });
    setAddressForm(newForm);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm({ ...addressForm, [name]: value });
  };

  const handleSaveAddress = async () => {
    // Labels use '.' instead of ':' to pass backend validation
    const labeledData = [
      `Firstname: ${addressForm.firstName}`,
      `Lastname: ${addressForm.lastName}`,
      `Address1: ${addressForm.address1}`,
      `Address2: ${addressForm.address2}`,
      `City: ${addressForm.city}`,
      `Zip: ${addressForm.zipCode}`,
      `Company: ${addressForm.company}`,
      `Contact: ${addressForm.contactNumber}`
    ].filter(val => !val.endsWith('. ')).join(", ");
    
    if (!addressForm.address1 || !addressForm.city) return alert("Please fill in required fields");

    const payload = {
      first_name: addressForm.firstName || userData.first_name,
      last_name: addressForm.lastName || userData.last_name,
      phone_number: addressForm.contactNumber || userData.phone_number,
      email_id: userData.email_id,
      delivery_address: labeledData, 
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
        localStorage.setItem("customer", JSON.stringify(result.body.customer));
        setUserData(result.body.customer);
        setIsEditing(false); 
        alert("Address updated successfully!");
      } else {
        alert(result.head.msg);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Extract values for the "Saved Card" view display
  const getField = (label) => {
    if (!userData?.delivery_address) return "";
    const match = userData.delivery_address.split(", ").find(s => s.startsWith(label + ". "));
    return match ? match.split(". ")[1] : "";
  };

  // --- VIEW: SAVED ADDRESS (EXACT FORM LAYOUT) ---
  const renderSavedAddressCard = () => (
    <Card className="shadow-sm border-0 rounded-4 p-4 mx-auto mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 w-100 text-center fw-normal" style={{ fontSize: '1.25rem' }}>Delivery address</h5>
        <div className="d-flex align-items-center">
          <FaEdit 
            className="me-3 text-muted" 
            style={{ cursor: 'pointer' }} 
            onClick={() => parseAddressForEditing(userData.delivery_address)} 
            size={20}
          />
          <button type="button" className="btn-close" onClick={() => setUserData({...userData, delivery_address: null})}></button>
        </div>
      </div>

      <div className="px-2">
        <Row className="mb-3">
          <Col md={6}>
            <label className="small text-muted d-block">First name</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Firstname") || userData.first_name}</div>
          </Col>
          <Col md={6}>
            <label className="small text-muted d-block">Last name</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Lastname") || userData.last_name}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <label className="small text-muted d-block">Address line 1</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Address1")}</div>
          </Col>
          <Col md={6}>
            <label className="small text-muted d-block">Address line 2</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Address2")}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <label className="small text-muted d-block">Company</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Company")}</div>
          </Col>
          <Col md={4}>
            <label className="small text-muted d-block">Postal/Zip Code</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("Zip")}</div>
          </Col>
          <Col md={4}>
            <label className="small text-muted d-block">Contact number</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>+91 {getField("Contact") || userData.phone_number}</div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <label className="small text-muted d-block">City</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>{getField("City")}</div>
          </Col>
          <Col md={6}>
            <label className="small text-muted d-block">Country</label>
            <div className="p-2 rounded-2" style={{backgroundColor: '#eff2f7', height: '45px', display: 'flex', alignItems: 'center'}}>India</div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  const renderEditForm = () => (
    <Card className="shadow-sm border-0 rounded-4 p-4 mx-auto mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 w-100 text-center fw-normal" style={{ fontSize: '1.25rem' }}>Edit address</h5>
        <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
      </div>
      <Form>
        <Row className="mb-3">
          <Col md={6}><Form.Label className="small text-muted">First name</Form.Label><Form.Control name="firstName" value={addressForm.firstName} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
          <Col md={6}><Form.Label className="small text-muted">Last name</Form.Label><Form.Control name="lastName" value={addressForm.lastName} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}><Form.Label className="small text-muted">Address line 1</Form.Label><Form.Control name="address1" value={addressForm.address1} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
          <Col md={6}><Form.Label className="small text-muted">Address line 2</Form.Label><Form.Control name="address2" value={addressForm.address2} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}><Form.Label className="small text-muted">Company</Form.Label><Form.Control name="company" value={addressForm.company} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
          <Col md={4}><Form.Label className="small text-muted">Postal/Zip Code</Form.Label><Form.Control name="zipCode" value={addressForm.zipCode} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
          <Col md={4}><Form.Label className="small text-muted">Contact number</Form.Label><div className="d-flex align-items-center px-2" style={{backgroundColor: '#eff2f7', borderRadius: '5px', height: '45px'}}><span className="me-2 small">+91</span><Form.Control name="contactNumber" value={addressForm.contactNumber} onChange={handleInputChange} style={{backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}} /></div></Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}><Form.Label className="small text-muted">City</Form.Label><Form.Control name="city" value={addressForm.city} onChange={handleInputChange} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}} /></Col>
          <Col md={6}><Form.Label className="small text-muted">Country</Form.Label><Form.Select name="country" value={addressForm.country} style={{backgroundColor: '#eff2f7', border: 'none', height: '45px'}}><option>India</option></Form.Select></Col>
        </Row>
        <div className="text-end mt-4"><Button variant="danger" className="px-5 py-2 fw-bold" onClick={handleSaveAddress} style={{borderRadius: '8px', minWidth: '150px'}}>Save</Button></div>
      </Form>
    </Card>
  );

  const renderEmptyAdd = () => (
    <div className="text-center p-5">
      <Card 
        className="mx-auto border-dashed d-flex flex-column align-items-center justify-content-center p-4 rounded-4" 
        style={{ border: '1px dashed #ddd', cursor: 'pointer', maxWidth: '400px' }}
        onClick={() => setIsEditing(true)}
      >
        <div className="text-danger mb-2"><FaPlusCircle size={30} /></div>
        <span className="btn btn-danger btn-sm rounded-pill px-4">Add/Change address</span>
      </Card>
    </div>
  );

  return (
    <div className="container-fluid">
      <h2 className="mb-4 text-capitalize text-center">Good morning! {userData?.first_name}</h2>
      {isEditing ? renderEditForm() : (userData?.delivery_address ? renderSavedAddressCard() : renderEmptyAdd())}
    </div>
  );
};

export default DeliveryAddress;