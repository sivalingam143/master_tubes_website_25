import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { Container, Row, Col, Accordion, Spinner } from "react-bootstrap";
import { DoButton, Buttons } from "../components/Button"; // Assuming Buttons is available

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // State for recommendations
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const API_BASE = "http://localhost/master_tubes_website_api/api";
  const COMPANY_ID = "COMP-000001";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch Main Product Details
        const response = await fetch(`${API_BASE}/product.php`, {
          method: "POST",
          body: JSON.stringify({ 
            company_id: COMPANY_ID, 
            product_id: productId, 
            fetch_all: false 
          }),
        });
        const data = await response.json();
        
        if (data.head.code === 200 && data.body.products.length > 0) {
          const mainProduct = data.body.products[0];
          setProduct(mainProduct);

          // 2. Fetch Related Products from the same category
          const relatedRes = await fetch(`${API_BASE}/product.php`, {
            method: "POST",
            body: JSON.stringify({ 
              company_id: COMPANY_ID, 
              fetch_all: true 
            }),
          });
          const relatedData = await relatedRes.json();
          
          if (relatedData.head.code === 200) {
            // Filter products that belong to the same category, excluding the current product
            const filtered = relatedData.body.products.filter(
              (p) => String(p.category_id) === String(mainProduct.category_id) && p.product_id !== productId
            );
            setRelatedProducts(filtered);
          }
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetails();
  }, [productId]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (!product) return <div className="text-center py-5">Product not found.</div>;
const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  return (
    <section className="py-5">
      <Container>
        {/* Main Product Section */}
        <Row>
          <Col lg="6" className="text-center">
            <img src={product.product_img_url} className="img-fluid1 rounded" alt={product.product_name} />
          </Col>
          <Col lg="6">
            <Row>
              <div className="product-content my-5">
                <h2 className="body-font py-3">{product.product_name}</h2>
                <div className="price-content title-font d-flex align-items-center">
                  <div className="text-muted text-decoration-line-through me-3">RS. {product.product_price}</div>
                  <div className="text-danger fw-bold h4 m-0">RS. {product.product_with_discount_price}</div>
                </div>
               <div className="pt-3">
  <DoButton 
    value={quantity} 
    onAdd={handleIncrease} 
    onSubtract={handleDecrease} 
  />
</div>
              </div>
            </Row>

            <div className="product-action-container">
              <button className="btn btn-add-cart w-100 fw-bold mb-3">ADD TO CART</button>
              <div className="wishlist-wrapper d-flex w-100 mb-3">
                <button className="btn btn-wishlist flex-grow-1 fw-bold">ADD TO WISHLIST</button>
              </div>
            </div>

            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="body-font">Description</Accordion.Header>
                <Accordion.Body className="title-font">
                  <p><strong>Code:</strong> {product.product_code}</p>
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
                <Col lg="3" md="4" sm="6" key={item.product_id} className="mb-4">
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
                        src={item.product_img_url || "https://via.placeholder.com/150"} 
                        alt={item.product_name} 
                        className="img-fluid"
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="product-content mt-2">
                      <div className="body-font fw-bold" style={{ fontSize: '0.9rem' }}>{item.product_name}</div>
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