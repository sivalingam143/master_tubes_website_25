import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import API_DOMAIN from "../config/config";
import { MdMailOutline, MdAccessTime } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const storedCustomer = JSON.parse(localStorage.getItem("customer")) || {};
  const [formData, setFormData] = useState({
    name: storedCustomer.first_name
      ? `${storedCustomer.first_name} ${storedCustomer.last_name || ""}`.trim()
      : "",
    email: storedCustomer.email_id || "",
    phone: storedCustomer.phone_number || "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("customer"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.first_name || "",
        email: user.email_id || "",
        phone: user.phone_number || "",
      }));
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const getStoredData = () => {
    const user = JSON.parse(localStorage.getItem("customer")) || {};
    return {
      name: user.first_name || "", // Restores only First Name as requested
      email: user.email_id || "",
      phone: user.phone_number || "",
      comment: "" // Comment should always be cleared
    };
  };
    try {
      const response = await fetch(`${API_DOMAIN}/contact.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.head.code === 200) {
        toast.success("Message sent successfully!");
        setFormData(getStoredData());
        setTimeout(() => {
        navigate("/"); 
      }, 1500);
        // setFormData({ name: "", email: "", phone: "", comment: "" });
      } else {
        alert("Error: " + result.head.msg);
      }
    } catch (error) {
      console.error("Submission Error", error);
      alert("Failed to connect to the server.");
    }
  };
  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            {/* Left Side: Contact Information */}
            <Col lg={5} className="py-3">
              <div className="contact-info-section">
                <div className="mb-4">
                  <p className="title-font text-muted">
                    Master Tubes, Madurai 625005, Tamilnadu, India
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold">Sales</h6>
                  <p className="mb-0">+91 93608 26673 (Call/WhatsApp)</p>
                  <h6 className="fw-bold mt-3">Support</h6>
                  <p>+91 93608 26673</p>
                </div>

                <div className="mb-4 d-flex align-items-center">
                  <MdMailOutline size={20} className="me-2" />
                  <span>saipackagingproducts@gmail.com</span>
                </div>

                <div className="mb-4 d-flex align-items-start">
                  <MdAccessTime size={20} className="me-2 mt-1" />
                  <div>
                    <p className="mb-0">
                      Monday to Saturday 09:30 AM - 06:30 PM
                    </p>
                    <p className="mb-0">Sunday 10:00 AM - 07:00 PM</p>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Side: Contact Form */}
            <Col lg={7} className="py-3">
              <h3 className="body-font mb-4">Contact form</h3>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Control
                      name="name"
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-light border-0 py-2"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Email*"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-light border-0 py-2"
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-light border-0 py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comment"
                    placeholder="Comment"
                    required
                    value={formData.comment}
                    onChange={handleChange}
                    className="bg-light border-0"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="danger"
                  className="px-5"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
