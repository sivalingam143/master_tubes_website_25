import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import StoreLogo from "../assets/images/Logo_1.avif";
import Forms from "./Forms";
import { Table } from "react-bootstrap";
import { MdOutlineDeleteOutline } from "react-icons/md";

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
  { label: "Blog", path: "/blog" },
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
            <span>99</span>
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
              <Nav>
                {menuLinks.map((item, i) => (
                  <Nav.Link
                    key={i}
                    as={NavLink}
                    to={item.path}
                    onClick={() => setShow(false)} // 👈 CLOSE HERE
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
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
              as="div"
              onClick={() => setShowCart(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="cart-mobile">
                <IoBagHandleOutline size={22} />
                <span>99</span>
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
          <div className="py-3">
            <Nav.Link className="login title-font">Login Here</Nav.Link>
          </div>
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
                <tr>
                  <td >
                    <div className="title-font cart-font" >7cm Green (1 Box)</div>
                    <div className="cart-font body-font ">
                      {" "}
                      <span className="discount_price">Rs. 19.50</span>{" "}
                      <span className="mx-2">Rs. 18.53</span>
                    </div>
                      <DoButton/>
                  </td>
                  <td>
                    <div className="cart-font body-font w-100">
                      {" "}
                      <div className="discount_price">Rs. 19.50</div>{" "}
                      <div>Rs. 18.53</div>
                    </div>
                  </td>
                  <td>
                    <div className="cart-font text-center">
                      <MdOutlineDeleteOutline />
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppBar;
