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
  const [showCart, setShowCart] = useState(false);
  const [show, setShow] = useState(false);
  const cartContext = useCart();
  const cartItems = cartContext ? cartContext.cartItems : [];
  const removeFromCart = cartContext ? cartContext.removeFromCart : () => {};

  // Calculate total count for the red badge
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
          {/* CART ITEMS HERE */}
          <p className="title-font">Your cart items will appear here</p>
          <button className="py-3 shop_now body-font">
            Continue To Shopping
          </button>

          <div>
            <Table>
              <thead>
                <tr>
                  <td>Products</td>
                  <td>Price</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product_id}>
                    <td>
                      <div className="title-font cart-font">
                        {item.product_name}
                      </div>
                      <div className="text-muted small">
                        Qty: {item.quantity}
                      </div>
                      <div className="text-danger small">
                        Rs. {item.product_with_discount_price}
                      </div>
                    </td>
                    <td>
                      <div className="cart-font body-font">
                        Rs.{" "}
                        {(
                          item.product_with_discount_price * item.quantity
                        ).toFixed(2)}
                      </div>
                    </td>
                    <td className="text-center">
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
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppBar;
