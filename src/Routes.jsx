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

//Bottom Section
import Account from "./Pages/Account";

const Routes = [
  { path: "/", element: <Home /> },
  { path: "/shop", element: <Shop /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/wishlist", element: <WishList /> },
  { path: "/account", element: <Account /> },
  { path: "/cart", element: <h1>Cart</h1> },
  { path: "/prdt/:productId", element: <ProductDetails /> },
  { path: "/login", element: <Login /> },

  // Update this section for Nested Routing
  {
    path: "/profile",
    element: <ProfileLayout />, // This contains the Red Sidebar
    children: [
      { path: "", element: <ProfileForm /> }, // URL: /profile (The Form)
      { path: "address", element: <DeliveryAddress /> }, // URL: /profile/address
    ],
  },
];

export default Routes;
