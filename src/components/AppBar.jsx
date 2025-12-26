import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import StoreLogo from "../assets/images/category/Logo2.png";
import Forms from "./Forms";
import { Table } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useCart } from "./CartContext";

// import Forms from "./Forms";
import {
  IoBagHandleOutline,
  IoPersonOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { DoButton } from "./Button";

/* ===== MENU DATA ===== */
const menuLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  // { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const iconLinks = [
  { icon: <IoPersonOutline size={22} />, path: "/profile" },
  { icon: <IoHeartOutline size={22} />, path: "/wishlist" },
];

function AppBar() {
  const { cartItems, showCart, setShowCart } = useCart();
  const [show, setShow] = useState(false);
  const cartContext = useCart();
  const removeFromCart = cartContext ? cartContext.removeFromCart : () => {};
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.product_price) * item.quantity,
    0
  );
  const totalDiscountedPrice = cartItems.reduce(
    (acc, item) =>
      acc + Number(item.product_with_discount_price) * item.quantity,
    0
  );
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <>
      {/* ================= MOBILE APP BAR ================= */}
      <Navbar expand="lg" className="p-0 body-font d-lg-none d-block">
        <Container fluid className="px-lg-5">
          {/* Toggle */}
          <Navbar.Toggle onClick={() => setShow(true)} />

          <Navbar.Brand as={NavLink} to="/" className="mx-auto">
            <img src={StoreLogo} alt="Logo" className="img-fluid logo" />
          </Navbar.Brand>

          <div className="cart-mobile" onClick={() => setShowCart(true)}>
            <IoBagHandleOutline size={22} />
            <span>{totalItems}</span>
          </div>
          {/* Offcanvas */}
          <Navbar.Offcanvas
            show={show}
            onHide={() => setShow(false)}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <img src={StoreLogo} alt="Logo" className="img-fluid logo" />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <Table>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product_id}>
                        <td>
                          <div className="cart-font">{item.product_name}</div>
                          <div className="text-muted small">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-danger">
                            Rs. {item.product_with_discount_price}
                          </div>
                        </td>
                        <td className="text-center">
                          <MdOutlineDeleteOutline
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => removeFromCart(item.product_id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div className="mx-auto w-100">
            {/* <Forms
            type="text"
            placeholder="Search products"
            value={search}
            onChange={handleSearchChange}
            onClear={clearSearch}
  /> */}
          </div>
        </Container>
      </Navbar>

      {/* ================= DESKTOP APP BAR ================= */}
      <Navbar expand="lg" className="p-0 body-font d-none d-lg-block">
        <Container fluid className="px-lg-5">
          <Navbar.Brand as={NavLink} to="/">
            <img src={StoreLogo} alt="Logo" className="img-fluid logo" />
          </Navbar.Brand>

          <div className="mx-auto w-50">
            <Forms PlaceHolder="Search Products" />
          </div>

          <Nav className="ms-auto align-items-center gap-3">
            {iconLinks.map((item, i) => (
              <Nav.Link key={i} as={NavLink} to={item.path}>
                {item.icon}
              </Nav.Link>
            ))}

            <Nav.Link
              onClick={() => setShowCart(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="cart-mobile">
                <IoBagHandleOutline size={22} />
                <span>{totalItems}</span> {/* REAL COUNT */}
              </div>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {/* ================= DESKTOP APP BAR ================= */}
      <Navbar expand="lg" className=" body-font d-none d-lg-block nav-bg p-0">
        <Container fluid className="px-lg-5">
          <Nav>
            {menuLinks.map((item, i) => (
              <Nav.Link
                className="mx-3 nav_link"
                key={i}
                as={NavLink}
                to={item.path}
                onClick={() => setShow(false)} // 👈 CLOSE HERE
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="body-font">Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="title-font">Your cart is empty</p>
              <button
                className="py-3 shop_now body-font"
                onClick={() => setShowCart(false)}
              >
                Continue To Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Scrollable Items List */}
              <div
                style={{
                  maxHeight: "55vh",
                  overflowY: "auto",
                  marginBottom: "20px",
                }}
              >
                <Table responsive borderless>
                  <thead>
                    <tr
                      className="border-bottom cart-font text-muted"
                      style={{ fontSize: "12px" }}
                    >
                      <th>Products</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product_id} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center">
                            {/* --- PRODUCT IMAGE --- */}
                            <img
                              src={item.product_img_url}
                              alt={item.product_name}
                              className="me-2 rounded border"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <div
                                className="title-font fw-bold"
                                style={{ fontSize: "14px", lineHeight: "1.2" }}
                              >
                                {item.product_name}
                              </div>
                              <div className="text-muted small">
                                Qty: {item.quantity}
                              </div>
                              <div
                                className="text-danger small"
                                style={{ textDecoration: "line-through" }}
                              >
                                Rs. {item.product_price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold align-middle">
                          Rs.{" "}
                          {(
                            item.product_with_discount_price * item.quantity
                          ).toFixed(2)}
                        </td>
                        <td className="text-center align-middle">
                          <MdOutlineDeleteOutline
                            size={20}
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => removeFromCart(item.product_id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* --- PRICE DETAILS SECTION --- */}
              <div className="p-3 border rounded bg-light mt-auto">
                <h6 className="body-font fw-bold border-bottom pb-2 mb-3">
                  Price Details
                </h6>

                <div className="d-flex justify-content-between mb-2">
                  <span>Price ({cartItems.length} items)</span>
                  <span>Rs. {totalOriginalPrice.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>- Rs. {totalSavings.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 pt-2 border-top fw-bold h5">
                  <span>Total Amount</span>
                  <span>Rs. {totalDiscountedPrice.toFixed(2)}</span>
                </div>

                <div
                  className="bg-success-subtle text-success p-2 rounded text-center small mb-3 fw-bold"
                  style={{ backgroundColor: "#d1e7dd" }}
                >
                  You will save Rs. {totalSavings.toFixed(2)} on this order!
                </div>

                <button
                  className="btn btn-warning w-100 fw-bold py-2 shadow-sm"
                  style={{
                    backgroundColor: "#fb641b",
                    color: "white",
                    border: "none",
                  }}
                >
                  PLACE ORDER
                </button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppBar;
