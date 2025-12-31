import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config";
import { toast } from "react-toastify";
import { State } from "country-state-city";
const Checkout = () => {
  const { cartItems, clearCart, setShowCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const statesInIndia = State.getStatesOfCountry("IN");
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

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    const parsedCustomer = JSON.parse(storedCustomer);
    setCustomer(parsedCustomer);

    // Completely blank form
    setAddressForm({
      first_name: "",
      last_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "", // Blank state
      pin_code: "",
      phone: "",
      country: "India", // Only keep country if required
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
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Define the shipping address string
    // const shippingAddress = `${addressForm.first_name} ${addressForm.last_name}, ${addressForm.address_line1}, ${addressForm.city}, ${addressForm.state}, ${addressForm.pin_code}, ${addressForm.country}, Phone: ${addressForm.phone}`;
    const shippingAddress = ` FirstName :${addressForm.first_name} ,LastName:${addressForm.last_name}, Adddress1:${addressForm.address_line1},City: ${addressForm.city}, State:${addressForm.state},Pincode: ${addressForm.pin_code},Country : ${addressForm.country}, PhoneNumber: ${addressForm.phone}`;

    const productDetails = cartItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.product_with_discount_price,
    }));
    // 2. Prepare the payload (This was missing in your snippet)
    const payload = {
      customer_id: customer.customer_id,
      product_details: cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.product_with_discount_price,
      })),
      shipping_address: shippingAddress,
      total_items: totalItems,
      sub_total: subTotal,
      discount: discount,
      shipping_charges: shippingCharges,
      grand_total: grandTotal,
    };

    try {
      const response = await fetch(`${API_DOMAIN}/order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const result = await response.json();

      if (result.head && result.head.code === 200) {
        toast.success(result.head.msg || "Order placed successfully!");
        if (typeof clearCart === "function") {
          clearCart();
        }
        navigate("/profile/orders");
      } else {
        toast.error(result.head?.msg || "Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Network error. Please check your connection and try again.");
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
          <Col lg={7}>
            <h3 className="mb-4">Shipping Address</h3>
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
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
                  as="textarea" // Changed from type="text"
                  rows={3} // Sets the initial height
                  name="address_line1"
                  value={addressForm.address_line1}
                  onChange={handleInputChange}
                  placeholder="House No, Street, etc."
                  required
                  style={{ resize: "none" }} // Optional: prevents user from manual resizing
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
              <Button variant="secondary" onClick={handleReturnToCart}>
                Return to Cart
              </Button>
            </Form>
          </Col>

          {/* Right: Order Summary */}
          <Col lg={5}>
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
                disabled={loading || cartItems.length === 0}
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
