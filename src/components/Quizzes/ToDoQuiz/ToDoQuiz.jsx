import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox, Pagination, Button, Modal, Progress } from "antd";
import { getDataQuiz } from "../../../services/apiServices";
import "./ToDoQuiz.scss";

const Quiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [quizResult, setQuizResult] = useState({
    correctCount: 0,
    incorrectCount: 0,
    score: 0,
  });
  const [timeLeft, setTimeLeft] = useState(600);
  const [progress, setProgress] = useState(100);
  const [isTimeRunning, setIsTimeRunning] = useState(true);

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions || []);
    };
    fetchDataQuiz();

    const savedAnswers = localStorage.getItem("userAnswers");
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, [id]);

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate("/"); // Navigate back to homepage or other desired page
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close modal
  };

  useEffect(() => {
    if (!isTimeRunning) return; // Do not run the timer if quiz is already submitted

    // Start a timer to update time passed
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleSubmitQuiz(); // Submit quiz automatically when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeRunning]);

  useEffect(() => {
    // Calculate progress based on the time passed (timeElapsed)
    const timeElapsed = 600 - timeLeft; // Total time (600 seconds) minus the time remaining
    setProgress(Math.round((timeElapsed / 600) * 100)); // Progress increases over time
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePaginationChange = (page) => {
    setCurrentIndex(page - 1);
  };

  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
  };

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;

    const unansweredQuestions = quiz.filter(
      (_, index) => userAnswers[index] === undefined
    );

    if (unansweredQuestions.length > 0) {
      setIsConfirmModalVisible(true);
      return;
    }

    calculateResults();
  };

  const calculateResults = () => {
    const results = quiz.map((question, index) => ({
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswers[index] !== undefined ? userAnswers[index] : null,
      isCorrect: userAnswers[index] === question.correctAnswer,
    }));

    const correctCount = results.filter((result) => result.isCorrect).length;
    const incorrectCount = results.length - correctCount;

    const score = ((correctCount / quiz.length) * 100).toFixed(2);

    setQuizResult({ correctCount, incorrectCount, score });
    setIsSubmitted(true);
    setIsTimeRunning(false); // Stop the timer when quiz is submitted

    // Hiển thị Modal với kết quả
    setIsModalVisible(true);
    setIsConfirmModalVisible(false);

    // Xóa trạng thái bài làm khi đã nộp
    localStorage.removeItem("userAnswers");
  };

  const handleMarkQuestion = (index) => {
    setMarkedQuestions((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <div className="container-quiz">
        <div className="table-questions">
          <h1>Bản câu hỏi</h1>
          <div className="number-questions">
            {quiz.map((q, index) => {
              const isAnswered = userAnswers[index] !== undefined;
              const isCorrect =
                isAnswered && userAnswers[index] === q.correctAnswer;

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
              Câu hỏi {currentIndex + 1}: {quiz[currentIndex]?.question}
            </h2>
          </div>

          <div className="answers-quiz">
            {quiz[currentIndex]?.answers.map((answer, index) => {
              const isCorrect =
                userAnswers[currentIndex] === index &&
                userAnswers[currentIndex] === quiz[currentIndex].correctAnswer;
              const isIncorrect =
                userAnswers[currentIndex] === index &&
                userAnswers[currentIndex] !== quiz[currentIndex].correctAnswer;
              const isCorrectAnswer =
                quiz[currentIndex].correctAnswer === index && isSubmitted;

              return (
                <div key={index}>
                  <Checkbox
                    checked={userAnswers[currentIndex] === index}
                    onChange={() => handleSelectAnswer(currentIndex, index)}
                    disabled={isSubmitted}
                  >
                    <p
                      className={`answer-quiz ${
                        isCorrect && isSubmitted ? "correct-answer" : ""
                      } ${isIncorrect && isSubmitted ? "incorrect-answer" : ""}
              ${isCorrectAnswer && !isCorrect ? "correct-highlight" : ""}`}
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
            onClick={() => handleMarkQuestion(currentIndex)}
            className="marked-button"
          >
            {markedQuestions.includes(currentIndex)
              ? "Bỏ đánh dấu"
              : "Đánh dấu"}
          </Button>

          <div className="paginate-quiz">
            <Pagination
              current={currentIndex + 1}
              total={quiz.length * 10}
              onChange={handlePaginationChange}
              showSizeChanger={false}
            />
          </div>
        </div>

        <div className="submit-quiz">
          <span className="timer">{formatTime(timeLeft)}</span>
          {!isSubmitted ? (
            <Button
              type="primary"
              onClick={handleSubmitQuiz}
              disabled={isSubmitted}
            >
              Nộp bài
            </Button>
          ) : (
            <Button className="exit-button" onClick={() => navigate("/")}>
              Thoát
            </Button>
          )}
        </div>

        {/* Modal for quiz result */}
        <Modal
          title="Kết quả bài thi"
          open={isModalVisible}
          onOk={handleOk}
          okText="Xem lại"
          cancelText="Thoát"
          onCancel={handleCancel}
        >
          <div>
            <p>Số câu đúng: {quizResult.correctCount}</p>
            <p>Số câu sai: {quizResult.incorrectCount}</p>
            <p>Điểm số: {quizResult.score} điểm</p>
          </div>
        </Modal>

        {/* Modal for confirmation when quiz is incomplete */}
        <Modal
          title="Xác nhận"
          open={isConfirmModalVisible}
          onOk={calculateResults}
          okText="Nộp bài"
          cancelText="Làm tiếp"
          onCancel={() => setIsConfirmModalVisible(false)}
        >
          <p>Bạn chưa trả lời hết tất cả câu hỏi, bạn có muốn nộp bài không?</p>
        </Modal>
      </div>
    </>
  );
};

export default Quiz;
