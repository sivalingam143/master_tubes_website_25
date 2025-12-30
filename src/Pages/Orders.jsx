import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Spinner, Button, Collapse } from "react-bootstrap";
import API_DOMAIN from "../config/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track which order ID is currently expanded
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const storedCustomer = localStorage.getItem("customer");
        if (!storedCustomer) return;

        const { customer_id } = JSON.parse(storedCustomer);

        const response = await fetch(`${API_DOMAIN}/order.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              search_text: "",
            customer_id: customer_id,
          }),
        });

        const data = await response.json();
        if (data.head.code === 200) {
          setOrders(data.body.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const toggleDetails = (orderId) => {
    // If clicking the same one, close it. Otherwise, open the new one.
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <div className="orders-wrapper">
      <h4 className="fw-bold mb-4">Order History</h4>

      {orders.length === 0 ? (
        <Card className="p-5 text-center border-0 shadow-sm rounded-4">
          <p className="text-muted mb-0">No orders found in your history.</p>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.order_id} className="mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom py-3 px-4">
              <Row className="small text-muted align-items-center">
                <Col md={3}>
                  Order placed: <span className="text-dark fw-bold d-block">{order.order_date}</span>
                </Col>
                <Col md={3}>
                  Order no: <span className="text-dark fw-bold d-block">{order.order_no}</span>
                </Col>
                <Col md={2}>
                  Items: <span className="text-dark fw-bold d-block">{order.total_items}</span>
                </Col>
                <Col md={4} className="text-md-end mt-2 mt-md-0">
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="rounded-pill px-3 me-2"
                    onClick={() => toggleDetails(order.order_id)}
                  >
                    {expandedOrderId === order.order_id ? "Hide Details" : "View Details"}
                  </Button>
                
                </Col>
              </Row>
            </Card.Header>

            {/* Only this section collapses and expands */}
            <Collapse in={expandedOrderId === order.order_id}>
              <div>
                <Card.Body className="p-4">
                  {/* Product List */}
                  <div className="d-flex gap-4 overflow-auto pb-3 mb-3" style={{ scrollbarWidth: 'none' }}>
                    {order.product_details?.map((product, idx) => (
                      <div key={idx} className="text-center" style={{ minWidth: '110px' }}>
                        <div className="position-relative bg-light rounded-3 p-2 mb-2" style={{ border: '1px solid #eee' }}>
                          <img 
                            src={product.product_img_url || 'https://via.placeholder.com/80'} 
                            alt={product.product_name} 
                            style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                          />
                          <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                            {product.qty}
                          </Badge>
                        </div>
                        <div className="small text-truncate" style={{ maxWidth: '110px' }}>{product.product_name}</div>
                 
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="pt-3 border-top" style={{ maxWidth: '320px', marginLeft: 'auto' }}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-bold text-dark">Rs. {parseFloat(order.sub_total).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-1 text-success">
                      <span>Discount</span>
                      <span>- Rs. {parseFloat(order.discount).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Shipping</span>
                      <span className="fw-bold text-dark">Rs. {parseFloat(order.shipping_charges).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 pt-2 border-top bg-light p-2 rounded">
                      <span className="fw-bold">Grand Total</span>
                      <span className="fw-bold text-danger">Rs. {parseFloat(order.grand_total).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Address & Status */}
                  <div className="mt-3 pt-3 border-top d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                    <div className="small">
                      <span className="text-muted fw-bold">Shipping Address: </span>
                      <span className="text-muted">{order.shipping_address}</span>
                    </div>
                    <Badge 
                      bg={order.status === 0 ? "warning" : "success"} 
                      text={order.status === 0 ? "dark" : "white"}
                      className="p-2 px-3 rounded-pill"
                    >
                      {order.status === 0 ? "Order Processing" : "Delivered"}
                    </Badge>
                  </div>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        ))
      )}
    </div>
  );
};

export default Orders;