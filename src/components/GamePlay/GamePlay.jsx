import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Checkbox, Button, Pagination, Progress, Modal } from "antd";
import "./GamePlay.scss"; // Import CSS riêng nếu cần

// Socket instance
const socket = io("https://quizzlet-19y7.onrender.com/");

const GamePlay = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { search } = useLocation();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedModal, setIsSubmittedModal] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const totalTime = useRef(0);

  const answersRef = useRef([]);
  const params = new URLSearchParams(search);
  const usernameFromUrl = params.get("username");

  // Fetch questions from the server
  useEffect(() => {
    socket.emit("play-game", gameId);

    socket.on("game-questions", ({ questions, duration }) => {
      setQuestions(questions);
      totalTime.current = duration;

      const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
      const initialAnswers = questions.map((_, index) =>
        storedAnswers[index] !== undefined ? storedAnswers[index] : null
      );

      setAnswers(initialAnswers);
      answersRef.current = initialAnswers;

      setTimeRemaining(duration);
      setLoading(false);
    });

    socket.on("game-result", (result) => {
      setResult(result);
      setIsSubmitted(true);
    });

    return () => {
      socket.off("game-questions");
      socket.off("game-result");
    };
  }, [gameId]);

  // Timer for the quiz
  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  useEffect(() => {
    // Calculate progress based on the time passed (timeElapsed)
    const timeElapsed = totalTime.current - timeRemaining; // Total time 50 seconds) minus the time remaining
    setProgress(Math.round((timeElapsed / totalTime.current) * 100)); // Progress increases over time
  }, [timeRemaining]);

  // Handle answer selection
  const handleAnswerSelection = (questionIndex, answerIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answerIndex;
    setAnswers(updatedAnswers);

    answersRef.current = updatedAnswers;

    const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
    storedAnswers[questionIndex] = answerIndex;
    localStorage.setItem(gameId, JSON.stringify(storedAnswers));
  };

  // Submit answers to the server
  const handleSubmit = () => {
    if (isSubmitted) return;

    if (answers.every((answer) => answer !== null)) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
      return;
    }

    setIsSubmittedModal(true);
    socket.emit("submit-answers", {
      gameId,
      answers: answersRef.current,
      username: usernameFromUrl,
    });

    localStorage.removeItem(gameId);
    setIsSubmitted(true);
  };

  const handleSubmitOk = () => {
    socket.emit("submit-answers", {
      gameId,
      answers: answersRef.current,
      username: usernameFromUrl,
    });

    localStorage.removeItem(gameId);
    setIsSubmitted(true);
    setIsSubmittedModal(true);
  };

  const cancelSubmit = () => {
    setIsModalVisible(false);
  };

  // Navigate to a specific question
  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
  };

  // Mark or unmark a question
  const toggleMarkQuestion = (index) => {
    setMarkedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleOk = () => {
    setIsSubmittedModal(false);
  };

  // Render loading state
  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="container-quiz">
      <div className="table-questions">
        <h1>Bản câu hỏi</h1>
        <div className="number-questions">
          {questions.map((q, index) => {
            const isAnswered = answers[index] !== null;
            const isCorrect =
              isSubmitted && isAnswered && answers[index] === q.correctAnswer;

            return (
              <div
                key={q._id}
                className={`question-item ${
                  currentIndex === index ? "active" : ""
                } ${isAnswered ? "answered" : ""} ${
                  isSubmitted ? (isCorrect ? "correct" : "incorrect") : ""
                } ${
                  !isSubmitted && markedQuestions.includes(index)
                    ? "marked"
                    : ""
                }`}
                onClick={() => handleQuestionClick(index)}
                onDoubleClick={() => toggleMarkQuestion(index)}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-quiz">
        <div className="progress-bar">
          <Progress percent={progress} />
        </div>

        <div className="question-quiz">
          <h2>
            Câu hỏi {currentIndex + 1}: {questions[currentIndex]?.question}
          </h2>
        </div>

        <div className="answers-quiz">
          {questions[currentIndex]?.answers.map((answer, index) => {
            const isCorrect =
              answers[currentIndex] === index &&
              isSubmitted &&
              answers[currentIndex] === questions[currentIndex].correctAnswer;
            const isIncorrect =
              answers[currentIndex] === index &&
              isSubmitted &&
              answers[currentIndex] !== questions[currentIndex].correctAnswer;
            const isCorrectAnswer =
              isSubmitted && questions[currentIndex].correctAnswer === index;

            return (
              <div key={index}>
                <Checkbox
                  checked={answers[currentIndex] === index}
                  onChange={() => handleAnswerSelection(currentIndex, index)}
                  disabled={isSubmitted}
                >
                  <p
                    className={`answer-quiz ${
                      isCorrect ? "correct-answer" : ""
                    } ${isIncorrect ? "incorrect-answer" : ""} ${
                      isCorrectAnswer && !isCorrect ? "correct-highlight" : ""
                    }`}
                  >
                    {answer}{" "}
                    {isCorrect && isSubmitted && (
                      <span className="check-icon">✔️</span>
                    )}
                    {isIncorrect && isSubmitted && (
                      <span className="check-icon">❌</span>
                    )}
                    {isCorrectAnswer && !isCorrect && (
                      <span className="correct-text">(Đáp án đúng)</span>
                    )}
                  </p>
                </Checkbox>
              </div>
            );
          })}
        </div>

        <Button
          disabled={isSubmitted}
          onClick={() => toggleMarkQuestion(currentIndex)}
          className="marked-button"
        >
          {markedQuestions.includes(currentIndex) ? "Bỏ đánh dấu" : "Đánh dấu"}
        </Button>

        <div className="paginate-quiz">
          <Pagination
            current={currentIndex + 1}
            total={questions.length * 10}
            onChange={(page) => setCurrentIndex(page - 1)}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* <p>Time Remaining: {timeRemaining} seconds</p> */}

      <div className="submit-quiz">
        <span className="timer">{formatTime(timeRemaining)}</span>
        {!isSubmitted ? (
          <>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              Nộp bài
            </Button>
            <Modal
              title="Vẫn còn câu hỏi chưa làm"
              open={isModalVisible}
              onOk={handleSubmitOk}
              onCancel={cancelSubmit}
              okText="Nộp bài"
              cancelText="Tiếp tục làm"
            ></Modal>
          </>
        ) : (
          <Button className="exit-button" onClick={() => navigate("/")}>
            Thoát
          </Button>
        )}
      </div>

      <Modal
        title="Kết quả bài thi"
        open={isSubmittedModal}
        onOk={handleOk}
        okText="Xem lại"
        cancelText="Thoát"
        onCancel={handleCancel}
      >
        <div>
          <p>
            Số câu đúng: {result?.correctAnswersCount}/{result?.totalQuestions}
          </p>
          <p>
            Điểm số đạt được:{" "}
            {(
              (result?.correctAnswersCount / result?.totalQuestions) *
              100
            ).toFixed(2)}{" "}
            điểm
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default GamePlay;
