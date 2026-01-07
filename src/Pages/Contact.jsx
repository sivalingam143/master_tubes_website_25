import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button, Modal } from "react-bootstrap";
import API_DOMAIN from "../config/config";
import { MdMailOutline, MdAccessTime } from "react-icons/md";
import { FaStar } from "react-icons/fa"; // Run: npm install react-icons
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  // Feedback states
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_DOMAIN}/contact.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.head.code === 200) {
        toast.success("Message sent successfully!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  const handleSaveFeedback = async () => {
    if (!customerName || !rating) {
      toast.error("Please provide your name and a rating");
      return;
    }

    const payload = {
      name: customerName,
      rating: String(rating),
      city: customerCity,
      feedback: feedbackText
    };

    try {
      const response = await fetch(`${API_DOMAIN}/feedback.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.head.code === 200) {
        toast.success(result.head.msg);
        setShowFeedback(false);
        // Reset form
        setCustomerName("");
        setCustomerCity("");
        setRating(0);
        setFeedbackText("");
      } else {
        toast.error(result.head.msg);
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <>
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={5} className="py-3">
              <div className="contact-info-section">
                <div className="mb-4">
                  <p className="title-font text-muted">
                    Master Tubes, Madurai 625005, India
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
                    <p className="mb-0">Mon-Sat: 09:30 AM - 06:30 PM</p>
                    <p className="mb-0">Sun: 10:00 AM - 07:00 PM</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={7} className="py-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="body-font m-0">Contact form</h3>
                <Button
                  variant="dark" // Base variant
                  size="sm"
                  onClick={() => setShowFeedback(true)}
                  style={{
                    borderRadius: "20px",
                    padding: "5px 20px",
                    backgroundColor: "#ffc107", // Custom Gold color
                    color: "#000", // Black text for contrast
                    border: "none",
                  }}
                >
                  Feedback Form
                </Button>
              </div>
              <Form onSubmit={handleSubmit}>
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

                <div className="d-flex gap-3">
                  <Button type="submit" variant="danger" className="px-5">
                    Submit
                  </Button>
                  {/* <Button
                    variant="outline-dark"
                    onClick={() => setShowFeedback(true)}
                  >
                    Feedback
                  </Button> */}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feedback Modal */}
      <Modal show={showFeedback} onHide={() => setShowFeedback(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="body-font">Your Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-light border-0"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {/* --- Optional City Field --- */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">City (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your city"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="bg-light border-0"
                />
              </Form.Group>
            </Col>
          </Row>


          <Form.Group>
            <Form.Label className="small fw-bold">
              Comments (Max 500 chars)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={500}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what we can improve..."
              className="bg-light border-0"
            />
            <div className="text-end small text-muted mt-1">
              {feedbackText.length}/500
            </div>
          </Form.Group>
          <div className="text-center mb-4">
            <p className="fw-bold mb-2">Rate your experience</p>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    style={{ display: "none" }}
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    size={35}
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: "pointer", transition: "color 200ms" }}
                  />
                </label>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            className="save1"
            onClick={handleSaveFeedback}
            style={{ border: "none" }}
          >
            Save Feedback
          </Button>
          <Button className="cancel1" onClick={() => setShowFeedback(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Contact;
