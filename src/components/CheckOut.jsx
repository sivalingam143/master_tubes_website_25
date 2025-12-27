import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config"; // Adjust if needed

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
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
  const [shippingCharges, setShippingCharges] = useState(50); // Example fixed shipping
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check login
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    const parsedCustomer = JSON.parse(storedCustomer);
    setCustomer(parsedCustomer);
    // Prefill form
    setAddressForm({
      first_name: parsedCustomer.first_name,
      last_name: parsedCustomer.last_name,
      phone: parsedCustomer.phone_number.toString(),
      address_line1: parsedCustomer.delivery_address
        ? parsedCustomer.delivery_address.split(",")[0] || ""
        : "",
      address_line2: "",
      city: parsedCustomer.delivery_address
        ? parsedCustomer.delivery_address.split(",")[2] || ""
        : "",
      state: "Tamil Nadu", // Default or from DB
      pin_code: parsedCustomer.delivery_address
        ? parsedCustomer.delivery_address.split(",")[3] || ""
        : "",
      country: "India",
    });
  }, [navigate]);

  // Compute totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.product_with_discount_price) * item.quantity,
    0
  );
  const discount = cartItems.reduce(
    (acc, item) =>
      acc +
      (Number(item.product_price) - Number(item.product_with_discount_price)) *
        item.quantity,
    0
  );
  const grandTotal = subTotal + shippingCharges;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !addressForm.address_line1 ||
      !addressForm.city ||
      !addressForm.pin_code ||
      !addressForm.phone
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    // Format shipping address
    const shippingAddress = `${addressForm.first_name} ${
      addressForm.last_name
    }, ${addressForm.address_line1}${
      addressForm.address_line2 ? `, ${addressForm.address_line2}` : ""
    }, ${addressForm.city}, ${addressForm.state}, ${addressForm.pin_code}, ${
      addressForm.country
    }, Phone: ${addressForm.phone}`;

    // Format product details
    const productDetails = cartItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.product_with_discount_price,
    }));

    const payload = {
      customer_id: customer.customer_id,
      product_details: productDetails,
      shipping_address: shippingAddress,
      total_items: totalItems,
      sub_total: subTotal,
      discount: discount,
      shipping_charges: shippingCharges,
      grand_total: grandTotal,
    };

    try {
      const response = await fetch(`${API_DOMAIN}/order.php`, {
        // Assuming order.php
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.head.code === 200) {
        clearCart();
        alert(`Order placed successfully! Order No: ${result.body.order_no}`);
        navigate("/profile/orders"); // Or to success page
      } else {
        setError(result.head.msg);
      }
    } catch (err) {
      setError("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <Container>
        <Row>
          {/* Left: Shipping Address */}
          <Col lg={8}>
            <h3 className="mb-4">Shipping Address</h3>
            {error && <Alert variant="danger">{error}</Alert>}
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
                  type="text"
                  name="address_line1"
                  value={addressForm.address_line1}
                  onChange={handleInputChange}
                  placeholder="House No, Street, etc."
                  required
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
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="state"
                      value={addressForm.state}
                      onChange={handleInputChange}
                    >
                      <option>Tamil Nadu</option>
                      {/* Add more states */}
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
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Return to Cart
              </Button>
            </Form>
          </Col>

          {/* Right: Order Summary */}
          <Col lg={4}>
            <h5 className="mb-3">Order Summary</h5>
            <div className="border p-3 rounded">
              {cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.product_name} (x{item.quantity})
                  </span>
                  <span>
                    ₹
                    {(
                      Number(item.product_with_discount_price) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>₹{shippingCharges.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-success small">
                <span>You save ₹{discount.toFixed(2)}</span>
              </div>
              <Button
                variant="danger"
                className="w-100 mt-3"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Order"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Checkout;
