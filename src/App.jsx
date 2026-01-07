import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppBar from "./components/AppBar";
import Loader from "./components/Loader"; // Import your custom logo loader
import routes from "./Routes";
import "./components/Components.css";
import Bottoms from "./components/Bottoms";
import { CartProvider } from "./components/CartContext";

// Create a wrapper to handle the loading logic on route change
const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader when the path changes
    setLoading(true);

    // Hide loader after a short delay to allow content to settle
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Display your custom logo loader when loading is true */}
      {loading && <Loader />}
      
      <AppBar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
      <Bottoms />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
