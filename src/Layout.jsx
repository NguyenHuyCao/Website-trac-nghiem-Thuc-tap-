import { Routes, Route } from "react-router";
import App from "./App";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}></Route>
    </Routes>
  );
};

export default Layout;
