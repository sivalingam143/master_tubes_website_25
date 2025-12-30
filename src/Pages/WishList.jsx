import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Buttons } from "../components/Button";
import { Navigate, useNavigate } from "react-router-dom";
import API_DOMAIN from "../config/config";
const WishList = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const customerData = localStorage.getItem("customer");
  if (!customerData) {
    return <Navigate to="/login" replace />;
  }

  const customer = JSON.parse(customerData);

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_DOMAIN}/customer.php`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_profile",
            customer_id: customer.customer_id,
          }),
        });

        const data = await response.json();

        if (data.head.code === 200) {
          const wishlistJson = data.body.customer.wishlist_products;
          const parsedWishlist = wishlistJson ? JSON.parse(wishlistJson) : [];
          setWishlist(parsedWishlist);
        } else {
          setError(data.head.msg || "Failed to load wishlist.");
        }
      } catch (err) {
        setError("Network error. Please check your connection and try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = async (product_id) => {
    try {
      const response = await fetch("https://yourdomain.com/api/customer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle_wishlist",
          customer_id: customer.customer_id,
          product: { product_id: product_id },
        }),
      });

      const data = await response.json();

      if (data.head.code === 200 && !data.body.in_wishlist) {
        // Successfully removed
        setWishlist((prev) => prev.filter((item) => item.product_id !== product_id));

        // Optional: Update localStorage to keep it in sync
        const updatedCustomer = { ...customer };
        updatedCustomer.wishlist_products = data.body.wishlist;
        localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      } else {
        alert("Failed to remove item.");
      }
    } catch (err) {
      alert("Error removing item from wishlist.");
      console.error(err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-5 text-center">
        <Container>
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading your wishlist...</p>
        </Container>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-5">
        <Container>
          <Alert variant="danger">{error}</Alert>
          <div className="text-center">
            <Buttons label="Retry" onClick={() => window.location.reload()} />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="title-font">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <>
                  <div className="body-font my-4">Your wishlist looks empty</div>
                  <Buttons
                    label="Continue Shopping"
                    onClick={() => navigate("/products")} // Change to your products page route
                  />
                </>
              ) : (
                <div className="my-4 body-font">
                  You have {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your wishlist
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Wishlist Table - Only show if items exist */}
      {wishlist.length > 0 && (
        <section className="py-5">
          <Container>
            <Row>
              <Col lg="12">
                <Table responsive bordered hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Add to Cart</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((item) => (
                      <tr key={item.product_id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  marginRight: "15px",
                                }}
                              />
                            )}
                            <div>
                              <div className="title-font cart-font">
                                {item.name || item.title || "Unnamed Product"}
                              </div>
                              {item.variant && (
                                <small className="text-muted">
                                  Variant: {item.variant}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="cart-font body-font">
                            {item.original_price && item.original_price !== item.price && (
                              <div className="discount_price text-muted text-decoration-line-through">
                                Rs. {item.original_price}
                              </div>
                            )}
                            <div className="fw-bold">Rs. {item.price || item.discounted_price}</div>
                          </div>
                        </td>
                        <td>
                          <span className="text-success fw-bold">
                            {item.in_stock !== false ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td>
                          <Buttons
                            label="Add to Cart"
                            small
                            onClick={() => {
                              // You can implement add-to-cart logic here later
                              alert("Add to Cart feature coming soon!");
                            }}
                          />
                        </td>
                        <td className="text-center">
                          <MdOutlineDeleteOutline
                            size={26}
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => removeFromWishlist(item.product_id)}
                            title="Remove from wishlist"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

export default WishList;