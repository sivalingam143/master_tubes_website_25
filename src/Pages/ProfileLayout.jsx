import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
  FaHistory,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";

const ProfileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Check if logged in immediately and redirect if not
  const isLoggedIn = !!localStorage.getItem("customer");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Fetch customer details from local storage on component mount
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      setUserData(JSON.parse(storedCustomer));
    }
  }, []);

  // Logout function to clear storage and redirect
  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  // Helper to generate initials (e.g., "John Doe" -> "JD")
  const getInitials = () => {
    if (!userData?.first_name) return "U";
    const first = userData.first_name.charAt(0).toUpperCase();
    const last = userData.last_name
      ? userData.last_name.charAt(0).toUpperCase()
      : "";
    return first + last;
  };

  const navItems = [
    { name: "My profile", path: "/profile", icon: <FaUser /> },
    {
      name: "Delivery address",
      path: "/profile/address",
      icon: <FaMapMarkerAlt />,
      // badge: 1,
    },
    {
      name: "Order history",
      path: "/profile/orders",
      icon: <FaHistory />,
      // badge: 1,
    },
    {
      name: "My wishlist",
      path: "/profile/wishlist",
      icon: <FaHeart />,
      // badge: 0,
    },
  ];

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} md={5}>
          <div className="profile-sidebar bg-danger text-white p-4 rounded-4">
            <div className="d-flex align-items-center mb-4">
              <div
                className="bg-dark rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "50px", height: "50px" }}
              >
                {getInitials()}
              </div>
              <div className="ms-3">
                <h5 className="mb-0 text-capitalize">
                  {/* Dynamic Name from Local Storage */}
                  {userData
                    ? `${userData.first_name} ${userData.last_name}`
                    : "Loading..."}
                </h5>
                <small className="opacity-75">
                  {userData?.phone_number || "No phone linked"}
                </small>
              </div>
            </div>

            <nav className="profile-nav">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`nav-item d-flex justify-content-between align-items-center py-2 text-decoration-none text-white ${
                    location.pathname === item.path
                      ? "fw-bold border-start border-3 ps-2"
                      : "opacity-75"
                  }`}
                >
                  <span>
                    {item.icon} <span className="ms-2">{item.name}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="badge bg-light text-danger rounded-circle">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <hr />
              <div
                className="nav-item d-flex align-items-center py-2 opacity-75 cursor-pointer"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <FaSignOutAlt className="me-2" /> Log out
              </div>
            </nav>
          </div>
        </Col>

        <Col lg={8} md={7}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileLayout;
