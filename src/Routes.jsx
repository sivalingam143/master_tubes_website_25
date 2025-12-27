import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import WishList from "./Pages/WishList";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
// Profile Components
import ProfileLayout from "./Pages/ProfileLayout";
import ProfileForm from "./Pages/Profile";
import DeliveryAddress from "./Pages/DeliveryAddress";
import { Navigate } from "react-router-dom";
//Bottom Section
import Account from "./Pages/Account";
const Routes = [
  {
    path: "/home",
    element: <Home />,
  },
  { path: "/shop", element: <Shop /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/wishlist", element: <WishList /> },
  { path: "/account", element: <Account /> },
  { path: "/cart", element: <h1>Cart</h1> },
  { path: "/prdt/:productId", element: <ProductDetails /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <ProfileLayout />,
    children: [
      { path: "", element: <ProfileForm /> },
      { path: "address", element: <DeliveryAddress /> },
      { path: "orders", element: <h1>Orders</h1> }, // Add if needed
      { path: "wishlist", element: <WishList /> }, // Nested if needed
    ],
  },
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
];
export default Routes;
