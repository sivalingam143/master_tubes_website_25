import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import WishList from "./Pages/WishList";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

const Routes = [
  { path: "/", element: <Home/> },
  { path: "/shop", element: <Shop/> },
  { path: "/blog", element: <h1>Blog</h1> },
  { path: "/about", element:<About/> },
  { path: "/contact", element: <Contact/> },
  { path: "/profile", element: <h1>Profile</h1> },
  { path: "/wishlist", element: <WishList/> },
  { path: "/cart", element: <h1>Cart</h1> },
  { path: "/prdt/:productId", element: <ProductDetails/>},
  { path: "/login", element: <Login/>},
];
export default Routes