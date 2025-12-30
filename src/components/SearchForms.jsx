import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchForms = ({ placeholder }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const API_BASE = "http://localhost/master_tubes_website_api/api";

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/product.php`, {
          method: "POST",
          body: JSON.stringify({   search_text: "", }), // Using your existing READ logic
        });
        const data = await response.json();
        if (data.head.code === 200) {
          const filtered = data.body.products.filter((p) =>
            p.product_name.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
        }
      } catch (err) {
        console.error("Search API Error:", err);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (productId) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/prdt/${productId}`); // Navigates to ProductDetails
    window.scrollTo(0, 0);
  };

  return (
    <div className="position-relative w-100" ref={searchRef}>
      <input
        type="text"
        className="form-control rounded-pill border-2"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && query.length > 0 && (
        <div className="search-modal-dropdown shadow-lg bg-white position-absolute w-100 mt-2 rounded border" 
             style={{ zIndex: 9999, minWidth: '350px' }}>
          <div className="row g-0 p-3">
            {/* Left Column: Suggestions */}
            <div className="col-5 border-end">
              <div className="text-muted fw-bold mb-2 small">SUGGESTIONS</div>
              <div className="text-dark small py-1" style={{ cursor: 'pointer' }}>
                {query}
              </div>
            </div>

            {/* Right Column: Products */}
            <div className="col-7 ps-3">
              <div className="text-muted fw-bold mb-2 small">PRODUCTS</div>
              {results.slice(0, 4).map((item) => (
                <div 
                  key={item.product_id} 
                  className="d-flex align-items-center mb-3 search-item-hover"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(item.product_id)}
                >
                  <img 
                    src={item.product_img_url} // From product.php baseUrl
                    alt={item.product_name} 
                    style={{  height: "45px", objectFit: "contain" }}
                    className="me-2"
                  />
                  <div style={{ overflow: "hidden" }}>
                    <div className="small fw-bold text-truncate" style={{ maxWidth: "150px" }}>
                      {item.product_name}
                    </div>
                    <div className="small">
                      <span className="text-muted text-decoration-line-through me-1">Rs. {item.product_price}</span>
                      <span className="text-danger fw-bold">Rs. {item.product_with_discount_price}</span>
                    </div>
                  </div>
                </div>
              ))}
              {results.length === 0 && <div className="small text-muted">No products found.</div>}
            </div>
          </div>
          <div className="border-top p-2 text-center bg-light rounded-bottom">
            <small className="text-danger fw-bold" style={{ cursor: "pointer" }}>
              Search for "{query}" &rarr;
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForms;