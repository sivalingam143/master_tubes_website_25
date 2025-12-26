import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppBar from "./components/AppBar";
import routes from "./Routes";
import "./components/Components.css";
import Bottoms from "./components/Bottoms";
import { CartProvider } from "./components/CartContext";

function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <AppBar />
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {/* Logic to render nested child routes */}
            {route.children && route.children.map((child, childIndex) => (
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
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;