import { Routes, Route } from "react-router";
import App from "./App";
import AddQuiz from "./components/AddQuiz";
import Home from "./components/Home";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index path="" element={<Home />} />
        <Route path="add-quiz" element={<AddQuiz />} />
      </Route>
    </Routes>
  );
};

export default Layout;
