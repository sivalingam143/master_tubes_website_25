import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Accordion, Spinner } from "react-bootstrap";
import { DoButton, Buttons } from "../components/Button";
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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      const parsedData = JSON.parse(storedCustomer);
      setCustomer(parsedData);
    }
  }, []);

  const updateCustomerInLocalStorage = (updatedCustomer) => {
    try {
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      setCustomer(updatedCustomer);
    } catch (err) {
      console.error("Error updating customer in localStorage:", err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!customer || !customer.customer_id) {
      alert("Please log in to manage wishlist.");
      return;
    }

    if (!product) {
      alert("Product not available.");
      return;
    }

    setWishlistLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle_wishlist",
          customer_id: customer.customer_id,
          product: product,
        }),
      });
      const data = await response.json();

      if (data.head.code === 200) {
        // Update local state
        setIsInWishlist(data.body.in_wishlist);

        // Update localStorage and state
        const updatedCustomer = {
          ...customer,
          wishlist_products: data.body.wishlist,
        };
        updateCustomerInLocalStorage(updatedCustomer);
      } else {
        alert(data.head.msg || "Failed to update wishlist.");
      }
    } catch (err) {
      console.error("Wishlist API Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
       const fetchDetails = async () => {
      try {
        setLoading(true);

        // Fetch ALL products (or use a broad search that returns everything)
        const response = await fetch(`${API_DOMAIN}/product.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: "",  // Empty search returns all products (based on your current backend logic)
          }),
        });

        const data = await response.json();

        if (data.head.code === 200 && data.body.products.length > 0) {
          // Find the exact product by product_id in frontend
          const allProducts = data.body.products;
          const mainProduct = allProducts.find(
            (p) => p.product_id === productId
          );

          if (!mainProduct) {
            setLoading(false);
            return; // Will show "Product not found"
          }

          setProduct(mainProduct);

          // Check wishlist status
          let wishlist = [];
          if (customer && customer.wishlist_products) {
            try {
              wishlist = JSON.parse(customer.wishlist_products) || [];
            } catch (err) {
              console.error("Error parsing wishlist:", err);
              wishlist = [];
            }
          }
          setIsInWishlist(
            wishlist.some((item) => item && item.product_id === productId)
          );

          // Filter related products: same category, exclude current
          const filtered = allProducts.filter(
            (p) =>
              String(p.category_id) === String(mainProduct.category_id) &&
              p.product_id !== productId
          );
          setRelatedProducts(filtered);
        } else {
          console.error("No products returned from API");
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetails();
  }, [productId, customer]);
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (!product)
    return <div className="text-center py-5">Product not found.</div>;

  

  const buttonText = isInWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST";

  return (
    <section className="py-5">
      <Container>
        {/* Main Product Section */}
        <Row>
          <Col lg="6" className="text-center">
            <img
              src={product.product_img_url}
              className="img-fluid1 rounded"
              alt={product.product_name}
            />
          </Col>
          <Col lg="6">
            <Row>
              <div className="product-content my-5">
                <h2 className="body-font py-3">{product.product_name}</h2>
                <div className="price-content title-font d-flex align-items-center">
                  <div className="text-muted text-decoration-line-through me-3">
                    RS. {product.product_price}
                  </div>
                  <div className="text-danger fw-bold h4 m-0">
                    RS. {product.product_with_discount_price}
                  </div>
                </div>
                <div className="pt-3">
                <div className="pt-3">
  <DoButton
    value={quantity}
    onChange={setQuantity}
    min={1}  // prevents going below 1
    // max={100} // optional: add if you want an upper limit
  />
</div>
                </div>
              </div>
            </Row>

            <div className="product-action-container">
              <button
                className="btn btn-add-cart w-100 fw-bold mb-3"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
              <div className="wishlist-wrapper d-flex w-100 mb-3">
                <button
                  className="btn btn-wishlist flex-grow-1 fw-bold"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? "LOADING..." : buttonText}
                </button>
              </div>
            </div>

            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="body-font">
                  Description
                </Accordion.Header>
                <Accordion.Body className="title-font">
                  <p>
                    <strong>Code:</strong> {product.product_code}
                  </p>
                  <hr />
                  {product.product_details || "No description available."}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <hr className="my-5" />

        {/* Recommended Products Section */}
        {relatedProducts.length > 0 && (
          <div className="recommended-section">
            <h3 className="mb-4">Recommended Products</h3>
            <Row>
              {relatedProducts.slice(0, 4).map((item) => (
                <Col
                  lg="3"
                  md="4"
                  sm="6"
                  key={item.product_id}
                  className="mb-4"
                >
                  <div
                    className="product-box border rounded p-2 h-100 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/prdt/${item.product_id}`);
                      window.scrollTo(0, 0); // Scroll to top on change
                    }}
                  >
                    <div className="img-content text-center">
                      <img
                        src={
                          item.product_img_url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.product_name}
                        className="img-fluid"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="product-content mt-2">
                      <div
                        className="body-font fw-bold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {item.product_name}
                      </div>
                      <div className="price-content d-flex align-items-center mt-1">
                        <span className="text-danger fw-bold">
                          RS. {item.product_with_discount_price}
                        </span>
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
