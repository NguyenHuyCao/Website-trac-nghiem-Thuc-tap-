import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox, Pagination, Button, Modal, Progress } from "antd";
import { getDataQuiz } from "../../../services/apiServices";
import "./ToDoQuiz.scss";

const ToDoQuiz = () => {
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
  const [timeLeft, setTimeLeft] = useState(3); // 5 minutes (3 seconds)
  const [progress, setProgress] = useState(100);
  const [isTimeRunning, setIsTimeRunning] = useState(true);
  const [loading, setLoading] = useState(true); // Track loading state

  const [checkLimited, setCheckLimited] = useState(false);

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions);
      setLoading(false); // Set loading to false when data is loaded
    };
    fetchDataQuiz();

    // Load saved answers and other information from localStorage
    const savedTimeLeft = localStorage.getItem("timeLeft");
    const savedCurrentIndex = localStorage.getItem("currentIndex");

    const savedAnswers = localStorage.getItem("userAnswers");
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }

    if (savedTimeLeft) {
      setTimeLeft(JSON.parse(savedTimeLeft));
    }

    if (savedCurrentIndex) {
      setCurrentIndex(parseInt(savedCurrentIndex, 10));
    }
  }, [id]);

  useEffect(() => {
    if (loading || !isTimeRunning) return; // Chỉ bắt đầu đếm thời gian khi dữ liệu đã được tải và thời gian còn lại > 0

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          // Tự động nộp bài khi hết thời gian
          handleSubmitQuiz();
          return 0; // Đặt thời gian còn lại là 0
        }
        return prevTime - 1;
      });
    }, 1000);

    if (interval === 0) setCheckLimited(true);

    return () => clearInterval(interval);
  }, [isTimeRunning, loading]); // Bao gồm cả 'loading' trong dependencies

  useEffect(() => {
    // Calculate progress based on the time passed (timeElapsed)
    const timeElapsed = 3 - timeLeft; // Total time 5 minutes (3 seconds) minus the time remaining
    setProgress(Math.round((timeElapsed / 3) * 100)); // Progress increases over time

    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  }, [timeLeft]);

  useEffect(() => {
    // Save user answers to localStorage whenever they change
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const resultTime = `${minutes.toString().padStart(2, "0")} : ${secs
      .toString()
      .padStart(2, "0")}`;
    return resultTime;
  };

  const handlePaginationChange = (page) => {
    setCurrentIndex(page - 1);
  };

  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
  };

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    if (timeLeft === 0 || isSubmitted) return; // Ngăn chọn khi hết thời gian hoặc đã nộp bài
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitted) return;

    // Kiểm tra các câu hỏi chưa trả lời
    const unansweredQuestions = quiz.filter(
      (_, index) => userAnswers[index] === undefined
    );

    if (unansweredQuestions.length > 0 && !checkLimited) {
      console.log("isTimeRunning", checkLimited);
      setIsConfirmModalVisible(true);
      return;
    }

    // Tự động tính toán kết quả khi hết thời gian
    await calculateResults();
  };

  const calculateResults = async () => {
    if (quiz.length === 0) {
      console.error("Quiz data is not loaded yet.");
      return;
    }

    console.log(quiz); // This will log quiz data when it's available

    const results = quiz.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      return {
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer !== undefined ? userAnswer : null,
        isCorrect: isCorrect,
      };
    });

    const correctCount = results.filter((result) => result.isCorrect).length;
    const incorrectCount = results.length - correctCount;
    const score =
      quiz.length > 0 ? ((correctCount / quiz.length) * 100).toFixed(2) : 0;

    setQuizResult({ correctCount, incorrectCount, score });
    setIsSubmitted(true);
    setIsTimeRunning(false); // Dừng timer khi nộp bài

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

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate("/"); // Navigate back to homepage or other desired page
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close modal
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
                        ${
                          isCorrectAnswer && !isCorrect
                            ? "correct-highlight"
                            : ""
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
          <span className={`timer ${timeLeft === 0 ? "time-over" : ""}`}>
            {formatTime(timeLeft)}
          </span>

          {!isSubmitted ? (
            <Button
              type="primary"
              onClick={handleSubmitQuiz}
              disabled={isSubmitted}
            >
              Nộp bài
            </Button>
          ) : (
            <Button onClick={handleCancel} type="primary">
              Trở về trang chủ
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Kết quả bài thi"
      >
        <div className="quiz-result">
          <p>Điểm số của bạn: {quizResult.score} điểm</p>
          <p>Số câu đúng: {quizResult.correctCount}</p>
          <p>Số câu sai: {quizResult.incorrectCount}</p>
        </div>
      </Modal>

      <Modal
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        cancelText={"Xem bài"}
        onOk={calculateResults}
        okText={"Xác nhận"}
        title="Bạn có chắc chắn nộp bài?"
      >
        <p>Các câu hỏi chưa trả lời sẽ được tính là sai.</p>
      </Modal>
    </>
  );
};

export default ToDoQuiz;
