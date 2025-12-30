import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Table } from "react-bootstrap";
import { IoFilter } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Buttons, DoButton } from "../components/Button";
import Forms from "../components/Forms";
import { useCart } from "../components/CartContext";
import API_DOMAIN from "../config/config";
import { useLocation } from "react-router-dom";
const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const { addToDetails } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      window.scrollTo(0, 0);
    }
  }, [location.search]);

  // Now, update your product display logic (the part that filters the list)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id) === String(selectedCategory);
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Removed company_id from the request body
      const catRes = await fetch(`${API_DOMAIN}/category.php`, {
        method: "POST",
        body: JSON.stringify({ search_text: "" }),
      });
      const catData = await catRes.json();

      // Removed company_id from the request body
      const prodRes = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        body: JSON.stringify({ search_text: "" }),
      });
      const prodData = await prodRes.json();

      if (catData.head.code === 200) setCategories(catData.body.categories);
      if (prodData.head.code === 200) setProducts(prodData.body.products);
    } catch (error) {
      console.error("Error loading shop data:", error);
    }
  };
  const handleIncrease = (product) => {
    // 1. Update local quantity state for the UI counter
    setQuantities((prev) => ({
      ...prev,
      [product.product_id]: (prev[product.product_id] || 0) + 1,
    }));

    addToDetails(product, 1);
  };

  const handleDecrease = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  };
  return (
    <>
      <section className="py-5">
        <Container>
          {/* Top Controls */}
          <Row className="mb-4 align-items-end">
            <Col lg="6" md="6" className="py-2">
              <Forms
                type="select"
                PlaceHolder="select category"
                options={[
                  { label: "All Categories", value: "all" },
                  ...categories.map((c) => ({
                    label: c.category_name,
                    value: c.category_id,
                  })),
                ]}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </Col>

            <Col lg="4" md="4" className="py-2">
              <Forms
                PlaceHolder="Search Products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            {/* <Col lg="2" md="2" className="py-4 mb-1">
              <Buttons
                label={
                  <>
                    <IoFilter className="me-2" /> View Cart
                  </>
                }
                onClick={() => setShowFilter(true)}
                className="w-100"
              />
            </Col> */}
          </Row>

          {categories
            .filter(
              (cat) =>
                selectedCategory === "all" ||
                String(cat.category_id) === String(selectedCategory)
            )
            .map((cat) => {
              let categoryProducts = products.filter(
                (p) => String(p.category_id) === String(cat.category_id)
              );

              if (searchTerm.trim()) {
                categoryProducts = categoryProducts.filter((p) =>
                  p.product_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              }

              if (categoryProducts.length === 0) return null;

              return (
                <div key={cat.category_id} className="mb-5">
                  <div className="category-title-strip mb-3">
                    <h5 className="m-0 p-2 bg-light border-start border-4 border-warning">
                      {cat.category_name}
                    </h5>
                  </div>

                  <Row>
                    {categoryProducts.map((item) => (
                      <Col
                        lg="3"
                        md="4"
                        sm="6"
                        key={item.product_id}
                        className="mb-4"
                      >
                        <div className="product-box border rounded p-2 h-100">
                          <div className="img-content text-center">
                            <img
                              src={
                                item.product_img_url ||
                                "https://via.placeholder.com/150"
                              }
                              alt={item.product_name}
                              className="img-fluid"
                              style={{
                                maxHeight: "180px",
                                objectFit: "contain",
                              }}
                              onClick={() =>
                                navigate(`/prdt/${item.product_id}`)
                              }
                            />
                          </div>
                          <div className="product-content mt-2">
                            <div className="body-font fw-bold">
                              {item.product_name}
                            </div>
                            <div className="price-content d-flex align-items-center mt-1">
                              <span className="text-muted text-decoration-line-through small">
                                RS. {item.product_price}
                              </span>
                              <span className="text-danger fw-bold ms-2">
                                RS. {item.product_with_discount_price}
                              </span>
                            </div>
                            <div className="pt-2">
                              <DoButton
                                value={quantities[item.product_id] || 0} // Start at 0 if not added yet
                                onAdd={() => handleIncrease(item)} // Pass the whole 'item' object here
                                onSubtract={() =>
                                  handleDecrease(item.product_id)
                                }
                              />
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
    </>
  );
};

export default Shop;
