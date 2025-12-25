import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Essential for URL params
import { Container, Row, Col, Accordion, Spinner } from "react-bootstrap";
import { DoButton } from "../components/Button";

const ProductDetails = () => {
  const { productId } = useParams(); // Captured from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost/master_tubes_website_api/api";
  const COMPANY_ID = "COMP-000001";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/product.php`, {
          method: "POST",
          body: JSON.stringify({ 
            company_id: COMPANY_ID, 
            product_id: productId, // Required by your PHP script
            fetch_all: false 
          }),
        });
        const data = await response.json();
        if (data.head.code === 200 && data.body.products.length > 0) {
          setProduct(data.body.products[0]);
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

  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col lg="6" className="text-center">
            {/* Dynamic image from API */}
            <img src={product.product_img_url} className="img-fluid rounded" alt={product.product_name} />
          </Col>
          <Col lg="6">
            <div className="product-content my-5">
              <h2 className="body-font py-3">{product.product_name}</h2>
              <div className="price-content title-font d-flex align-items-center">
                <div className="text-muted text-decoration-line-through me-3">RS. {product.product_price}</div>
                <div className="text-danger fw-bold h4 m-0">RS. {product.product_with_discount_price}</div>
              </div>
              <div className="pt-3"><DoButton /></div>
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
      </Container>
    </section>
  );
};

export default ProductDetails;