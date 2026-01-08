import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config";
import { toast } from "react-toastify";
import { State } from "country-state-city";

const Checkout = () => {
  const location = useLocation();
  const { cartItems, clearCart, setShowCart } = useCart();
  const navigate = useNavigate();
  const statesInIndia = State.getStatesOfCountry("IN");
  const directOrder = location.state?.directOrder;
  // State for manual address entry
  const [addressForm, setAddressForm] = useState({
    first_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
    phone: "",
    country: "India",
  });


  const [loading, setLoading] = useState(false);


  // Compute totals
  const totalItems = directOrder?.quantity || 0;
  const subTotal = Number(directOrder.product_with_discount_price) * directOrder.quantity;
  const discount = (Number(directOrder.product_price) - Number(directOrder.product_with_discount_price)) * directOrder.quantity;
  const shippingCharges = 50;
  const grandTotal = subTotal + shippingCharges;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.address_line1 || !addressForm.city || !addressForm.pin_code || !addressForm.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const shippingAddress = `${addressForm.first_name} ${addressForm.last_name}, ${addressForm.address_line1}, ${addressForm.address_line2 ? addressForm.address_line2 + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.pin_code}, ${addressForm.phone}`;
    const payload = {
      product_details: [
        {
          product_id: directOrder.product_id,
          product_name: directOrder.product_name,
          quantity: directOrder.quantity,
          price: directOrder.product_with_discount_price,
          product_img: directOrder.product_img,
          type: directOrder.type,
          custom_description: directOrder.isCustomized ? directOrder.customDescription : ""
        }
      ],
      
      shipping_address: {
        firstName: addressForm.first_name,
        lastName: addressForm.last_name,
        address: addressForm.address_line1,
        apartment: addressForm.address_line2,
        city: addressForm.city,
        state: addressForm.state,
        pinCode: addressForm.pin_code,
        phone: addressForm.phone
      },
      total_items: totalItems,
      discount: discount,
      grand_total: grandTotal,
      sub_total: subTotal || 0,
      shipping_charges: 0
    };

    try {
      const response = await fetch(`${API_DOMAIN}/order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Server Error");

      const result = await response.json();

      if (result.head && result.head.code === 200) {
        toast.success(result.head.msg || "Order placed successfully!");
        clearCart();
        navigate("/shop");
      } else {
        toast.error(result.head?.msg || "Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToCart = () => {
    navigate(-1);
    setShowCart(true);
  };

  return (
    <section className="py-5">
      <Container>
        <Row>
          {/* Left Side: Manual Address Form */}
          <Col lg={7}>
            <h3 className="mb-4">Shipping Address</h3>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={addressForm.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={addressForm.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address_line1"
                  value={addressForm.address_line1}
                  onChange={handleInputChange}
                  placeholder="House No, Street, etc."
                  required
                  style={{ resize: "none" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apartment, suite, etc. (optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="address_line2"
                  value={addressForm.address_line2}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>State *</Form.Label>
                    <Form.Select
                      name="state"
                      value={addressForm.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {statesInIndia.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>PIN Code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pin_code"
                      value={addressForm.pin_code}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Phone *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <div className="mt-4">
                {/* <Button variant="secondary" onClick={handleReturnToCart} className="me-2">
                  Return to Cart
                </Button> */}
                <Button
                  variant="danger"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </Button>
              </div>
            </Form>
          </Col>

          {/* Right Side: Order Summary */}
          <Col lg={5}>
            <h5 className="mb-3">Order Summary</h5>
            <div className="border p-3 rounded bg-light">
              {/* Product Info Section */}
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <div className="fw-bold">{directOrder.product_name}</div>
                  {/* If Customized: Show CUSTOMIZE label, Qty, and Description ONLY */}
                  {directOrder.isCustomized ? (
                    <>
                      <div className="text-primary fw-bold" style={{ fontSize: "0.8rem" }}>
                        CUSTOMIZE ORDER
                      </div>
                      <div className="text-muted">Qty: {directOrder.quantity}</div>
                      {directOrder.customDescription && (
                        <div className="text-muted small mt-1">
                          <strong>Note:</strong> {directOrder.customDescription}
                        </div>
                      )}
                    </>
                  ) : (
                    /* If Ordinary: Show Qty normally */
                    <small className="text-muted">Qty: {directOrder.quantity}</small>
                  )}
                </div>

                {/* 1. Hide individual item price if customized */}
                {!directOrder.isCustomized && (
                  <span>₹{subTotal.toFixed(2)}</span>
                )}
              </div>

              <hr />

              {/* 2. Hide all financial rows if customized */}
              {!directOrder.isCustomized ? (
                <>

                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                /* 3. Message for customized products instead of totals */
                <div className="text-center py-2 text-muted italic small">
                  Pricing for customized items will be shared after order review.
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Checkout;