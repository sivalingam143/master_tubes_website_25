import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Accordion, Spinner, Form } from "react-bootstrap"; // Added Form
import { DoButton } from "../components/Button";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [customer, setCustomer] = useState(null);
  const { addToCart } = useCart();

  // New States for Customization
  const [isCustomized, setIsCustomized] = useState(false);
  const [customDescription, setCustomDescription] = useState("");

const handleShopNow = () => {
  const orderData = {
    product_id: product.product_id,
    product_name: product.product_name,
    // Always include these prices
    product_with_discount_price: product.product_with_discount_price,
    product_price: product.product_price,
    product_img: product.product_img_url,
    quantity: quantity,
    isCustomized: isCustomized,
    customDescription: isCustomized ? customDescription : ""
  };

  // Pass everything through navigation state
  navigate("/checkout", { state: { directOrder: orderData } });
};

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsedData = JSON.parse(storedCustomer);
      setCustomer(parsedData);
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_DOMAIN}/product.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });

        const data = await response.json();

        if (data.head.code === 200 && data.body.products.length > 0) {
          const allProducts = data.body.products;
          const mainProduct = allProducts.find((p) => p.product_id === productId);

          if (!mainProduct) {
            setLoading(false);
            return;
          }

          setProduct(mainProduct);

          let wishlist = [];
          if (customer && customer.wishlist_products) {
            try {
              wishlist = JSON.parse(customer.wishlist_products) || [];
            } catch (err) {
              wishlist = [];
            }
          }
          setIsInWishlist(wishlist.some((item) => item && item.product_id === productId));

          const filtered = allProducts.filter(
            (p) => String(p.category_id) === String(mainProduct.category_id) && p.product_id !== productId
          );
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetails();
  }, [productId, customer]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (!product) return <div className="text-center py-5">Product not found.</div>;

  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col lg="6" className="text-center">
            <img src={product.product_img_url} className="img-fluid1 rounded" alt={product.product_name} />
          </Col>
          <Col lg="6">
            {/* 1. Header & Price Section: Clean Grey Box */}
            <div className="product-content p-4 mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <h2 className="body-font mb-2" style={{ fontWeight: "600", color: "#333" }}>
                {product.product_name}
              </h2>

              {!isCustomized ? (
                <div className="price-content d-flex align-items-center mt-3">
                  <span className="text-muted text-decoration-line-through me-3" style={{ fontSize: "1.1rem" }}>
                    RS. {product.product_price}
                  </span>
                  <span className="text-danger fw-bold h3 m-0">
                    RS. {product.product_with_discount_price}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-primary fw-bold" style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>
                  CUSTOMIZE ORDER
                </div>
              )}
            </div>

            {/* 2. Selection Toggle: Modern Pill Style */}
            <div className="selection-toggle mb-4 p-1" style={{ backgroundColor: "#eee", borderRadius: "10px", display: "flex" }}>
              <button
                className="flex-grow-1 border-0 py-2"
                style={{
                  borderRadius: "8px",
                  transition: "0.3s",
                  backgroundColor: !isCustomized ? "#fff" : "transparent",
                  boxShadow: !isCustomized ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
                  fontWeight: !isCustomized ? "bold" : "normal",
                  color: "#333"
                }}
                onClick={() => setIsCustomized(false)}
              >
                Ordinary
              </button>
              <button
                className="flex-grow-1 border-0 py-2"
                style={{
                  borderRadius: "8px",
                  transition: "0.3s",
                  backgroundColor: isCustomized ? "#fff" : "transparent",
                  boxShadow: isCustomized ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
                  fontWeight: isCustomized ? "bold" : "normal",
                  color: "#333"
                }}
                onClick={() => setIsCustomized(true)}
              >
                Customize
              </button>
            </div>

            {/* 3. Customization Input: Elegant and Focus-Friendly */}
            {isCustomized && (
              <Form.Group className="mb-4 animate__animated animate__fadeIn">
                <Form.Label className="small fw-bold text-uppercase text-muted mb-2">
                  Specific Instructions
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter names, colors, or special dates for your piggy bank..."
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "0.95rem",
                    resize: "none",
                    backgroundColor: "#fff"
                  }}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                />
              </Form.Group>
            )}

            {/* 4. Quantity and Shop Now: Primary Actions */}
            <div className="d-flex align-items-center gap-1 mb-4">
              <div style={{ minWidth: "100px" }}>
                <DoButton value={quantity} onChange={setQuantity} min={1} />
              </div>
              <button
                className="btn  fw-bold shadow-sm"
                style={{
                  backgroundColor: "rgba(245, 71, 100, 1)",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "1rem",
                  transition: "transform 0.2s",
                  width: "200px"
                }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                onClick={handleShopNow}
              >
                Shop Now
              </button>
            </div>

            {/* 5. Product Details Accordion */}
            <Accordion defaultActiveKey="0">
  <Accordion.Item eventKey="0">
    <Accordion.Header className="body-font">
      Description
    </Accordion.Header>
    <Accordion.Body className="title-font">
      <div className="mb-3">
       
        
        {/* Added Height and Diameter/Width */}
        {product.height && (
          <p className="mb-1">
            <strong>Height:</strong> {product.height}
          </p>
        )}
        
        {product.diameter && (
          <p className="mb-1">
            <strong>Diameter:</strong> {product.diameter}
          </p>
        )}
         <p className="mb-1">
          <strong>Code:</strong> {product.product_code}
        </p>
      </div>
      
      <hr />
      <div className="mt-3">
        {product.product_details || "No description available."}
      </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
          </Col>
        </Row>

        <hr className="my-5" />

        {/* Recommended Products Section Remains Unchanged */}
        {relatedProducts.length > 0 && (
          <div className="recommended-section">
            <h3 className="mb-4">Recommended Products</h3>
            <Row>
              {relatedProducts.slice(0, 4).map((item) => (
                <Col lg="3" md="4" sm="6" key={item.product_id} className="mb-4">
                  <div
                    className="product-box border rounded p-2 h-100 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/prdt/${item.product_id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="img-content text-center">
                      <img
                        src={item.product_img_url || "https://via.placeholder.com/150"}
                        alt={item.product_name}
                        className="img-fluid"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="product-content mt-2">
                      <div className="body-font fw-bold" style={{ fontSize: "0.9rem" }}>
                        {item.product_name}
                      </div>
                      <div className="price-content d-flex align-items-center mt-1">
                        <span className="text-danger fw-bold">RS. {item.product_with_discount_price}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductDetails;