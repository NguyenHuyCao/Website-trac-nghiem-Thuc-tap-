import { Routes, Route } from "react-router";
import App from "./App";
import AddQuiz from "./components/AddQuiz/AddQuiz";
import Home from "./components/Home/Home";
import ShowQuiz from "./components/Quizzes/Quizzes.jsx";
import Quiz from "./components/Quizzes/ShowQuiz/Quiz.jsx";
import ToDoQuiz from "./components/Quizzes/ToDoQuiz/ToDoQuiz.jsx";
import HomeQuiz from "./components/Quizzes/ToDoQuiz/HomeQuiz.jsx";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import AdminGamePage from "./components/Admin/AdminGamePage.jsx";
import PlayerPanel from "./components/Player/PlayerPanel.jsx";
import GamePlay from "./components/GamePlay/GamePlay.jsx";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index path="" element={<Home />} />
        <Route path="show-quiz" element={<ShowQuiz />} />
        <Route path="show-quiz/:id" element={<Quiz />} />
        <Route path="add-quiz" element={<AddQuiz />} />

        {/* TEST CHỨC NĂNG */}
        <Route path="admin" element={<AdminPanel />} />

        <Route path="player" element={<PlayerPanel />} />
      </Route>
      <Route path="/game/:gameId/play" element={<GamePlay />} />
      <Route path="admin/game/:gameId" element={<AdminGamePage />} />
      <Route path="home-exam/:id" element={<HomeQuiz />} />
      <Route path="home-exam/:id/exam" element={<ToDoQuiz />} />
    </Routes>
  );
};

export default Layout;
