import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Buttons } from "../components/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config";

const WishList = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login check
  const customerData = localStorage.getItem("customer");
  if (!customerData) {
    return <Navigate to="/login" replace />;
  }

  const customer = JSON.parse(customerData);

  // Extracted fetch function so we can reuse it
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Refetch when page gains focus (e.g., user navigates back from Product Details)
  useEffect(() => {
    const handleFocus = () => fetchWishlist();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleAddToCart = (product) => {
    if (!product || product.product_stock <= 0) {
      alert("This item is out of stock.");
      return;
    }
    addToCart(product, 1);
  };

  const removeFromWishlist = async (product_id) => {
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_wishlist",
          customer_id: customer.customer_id,
          product: { product_id },
        }),
      });

      const data = await response.json();

      if (data.head.code === 200 && !data.body.in_wishlist) {
        setWishlist((prev) => prev.filter((item) => item.product_id !== product_id));

        // Update localStorage with latest wishlist from server
        const updatedCustomer = { ...customer, wishlist_products: data.body.wishlist };
        localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      } else {
        alert("Failed to remove item from wishlist.");
      }
    } catch (err) {
      alert("Error removing item.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <section className="py-5 text-center">
        <Container>
          <Spinner animation="border" />
          <p className="mt-3">Loading your wishlist...</p>
        </Container>
      </section>
    );
  }

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
      <section >
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="title-font">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <>
                  <div className="body-font ">Your wishlist looks empty</div>
                  <Buttons
                    label="Continue Shopping"
                    onClick={() => navigate("/products")}
                  />
                </>
              ) : (
                <div className=" body-font">
                  You have {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your wishlist
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

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
                     <th>Category</th>
                      <th>Add to Cart</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((item) => (
                      <tr key={item.product_id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.product_img_url}
                              alt={item.product_name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginRight: "15px",
                              }}
                              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                            />
                            <div>
                              <div className="title-font cart-font">{item.product_name}</div>
                              <small className="text-muted">Code: {item.product_code}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="cart-font body-font">
                            {item.product_disc_amt > 0 && (
                              <div className="text-muted text-decoration-line-through">
                                Rs. {parseFloat(item.product_price).toFixed(2)}
                              </div>
                            )}
                            <div className="fw-bold">
                              Rs.{" "}
                              {item.product_disc_amt > 0
                                ? parseFloat(item.product_with_discount_price).toFixed(2)
                                : parseFloat(item.product_price).toFixed(2)}
                            </div>
                          </div>
                        </td>
                      <td>
  <span className="body-font">
    {item.category_name || "Uncategorized"}   {/* Display category_name */}
  </span>
</td>
                        <td>
                          <Buttons
                            label="Add to Cart"
                            small
                            onClick={() => handleAddToCart(item)}
                            disabled={item.product_stock <= 0}
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