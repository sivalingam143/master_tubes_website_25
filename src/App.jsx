import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppBar from "./components/AppBar";
import routes from "./Routes";
import "./components/Components.css";
import Bottoms from "./components/Bottoms";

function App() {
  return (
    <BrowserRouter>
      <AppBar />

      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Bottoms />
    </BrowserRouter>
  );
}

export default App;
