import { Routes, Route } from "react-router";
import App from "./App";
import AddQuiz from "./components/AddQuiz/AddQuiz";
import Home from "./components/Home/Home";
import ShowQuiz from "./components/ShowQuiz/ShowQuizzes";
import Quiz from "./components/ShowQuiz/Quiz";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index path="" element={<Home />} />
        <Route path="show-quiz" element={<ShowQuiz />} />
        <Route path="show-quiz/:id" element={<Quiz />} />
        <Route path="add-quiz" element={<AddQuiz />} />
      </Route>
    </Routes>
  );
};

export default Layout;
