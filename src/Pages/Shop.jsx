import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Table } from "react-bootstrap";
import { IoFilter } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Buttons, DoButton } from "../components/Button";
import Forms from "../components/Forms";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const API_BASE = "http://localhost/master_tubes_website_api/api";
  const COMPANY_ID = "COMP-000001"; // Match your DB company_id

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Categories
      const catRes = await fetch(`${API_BASE}/category.php`, {
        method: "POST",
        body: JSON.stringify({ company_id: COMPANY_ID, fetch_all: true }),
      });
      const catData = await catRes.json();

      // 2. Fetch Products
      const prodRes = await fetch(`${API_BASE}/product.php`, {
        method: "POST",
        body: JSON.stringify({ company_id: COMPANY_ID, fetch_all: true }),
      });
      const prodData = await prodRes.json();

      if (catData.head.code === 200) setCategories(catData.body.categories);
      if (prodData.head.code === 200) setProducts(prodData.body.products);
    } catch (error) {
      console.error("Error loading shop data:", error);
    }
  };

  return (
    <>
      <section className="py-5">
        <Container>
          {/* Top Controls */}
          <Row className="mb-4">
            <Col lg="6" className="py-2">
              <Forms
                type="select"
                options={categories.map(c => ({ label: c.category_name, value: c.category_id }))}
              />
            </Col>
            <Col lg="6" className="py-2">
              <Forms PlaceHolder="Search Products..." />
            </Col>
            <Col lg="12">
              <Buttons
                label={<><IoFilter className="me-2" /> View Cart</>}
                onClick={() => setShowFilter(true)}
              />
            </Col>
          </Row>

          {/* Grouped Products by Category */}
        {categories.map((cat) => {
  // Use category_id (the string) to match, not the numeric .id
  const categoryProducts = products.filter(
    (p) => String(p.category_id) === String(cat.category_id)
  );

  // If products are not assigned to categories yet, 
  // they won't show up in this loop.
  if (categoryProducts.length === 0) return null;
            return (
              <div key={cat.category_id} className="mb-5">
                {/* Category Header Strip */}
                <div className="category-title-strip mb-3">
                  <h5 className="m-0 p-2 bg-light border-start border-4 border-warning">
                    {cat.category_name}
                   Wall</h5>
                </div>

                <Row>
                  {categoryProducts.map((item) => (
                    <Col lg="3" md="4" sm="6" key={item.product_id} className="mb-4">
                      <div className="product-box border rounded p-2 h-100" onClick={() => navigate(`/prdt/${item.product_id}`)}>
                        <div className="img-content text-center">
                          <img 
                            src={item.product_img_url || "https://via.placeholder.com/150"} 
                            alt={item.product_name} 
                            className="img-fluid"
                            style={{ maxHeight: '180px', objectFit: 'contain' }}
                          />
                        </div>
                        <div className="product-content mt-2">
                          <div className="body-font fw-bold">{item.product_name}</div>
                          <div className="price-content d-flex align-items-center mt-1">
                            <span className="text-muted text-decoration-line-through small">
                              RS. {item.product_price}
                            </span>
                            <span className="text-danger fw-bold ms-2">
                              RS. {item.product_with_discount_price}
                            </span>
                          </div>
                          <div className="pt-2">
                            <DoButton />
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Cart Offcanvas (Remains similar) */}
      <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table responsive>
            <thead>
              <tr>
                <td>Product</td>
                <td>Price</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {/* This would ideally map through a cart state */}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Shop;