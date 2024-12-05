import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://quizzlet-19y7.onrender.com/"); // Kết nối tới server

const GamePlay = () => {
  const { gameId } = useParams(); // Lấy gameId từ URL
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Câu hỏi hiện tại
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Câu trả lời đã chọn
  const [score, setScore] = useState(0); // Điểm số
  const [isGameOver, setIsGameOver] = useState(false); // Trạng thái kết thúc trò chơi

  useEffect(() => {
    // Phát sự kiện play-game để yêu cầu câu hỏi
    socket.emit("play-game", gameId);

    // Lắng nghe danh sách câu hỏi
    socket.on("game-questions", (questions) => {
      setQuestions(questions.questions);
      console.log("Bộ câu hỏi: ", questions);
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off("game-questions");
    };
  }, [gameId]);

  const handleAnswerSelection = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    // Kiểm tra câu trả lời đúng
    if (questions[currentQuestionIndex].correctAnswer === selectedAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Chuyển sang câu hỏi tiếp theo
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null); // Reset câu trả lời đã chọn
    } else {
      // Kết thúc trò chơi
      setIsGameOver(true);
    }
  };

  if (isGameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>
          Your Score: {score}/{questions.length}
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Game in Progress</h1>
      <p>Game ID: {gameId}</p>
      <h2>Question {currentQuestionIndex + 1}:</h2>
      <p>{currentQuestion.question}</p>
    </div>
  );
};

export default GamePlay;
