import { useParams } from "react-router-dom";
import { Checkbox, Pagination, Button, Modal, Progress } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataQuiz } from "../../../services/apiServices";
import "./ToDoQuiz.scss";

const Quiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [quizResult, setQuizResult] = useState({
    correctCount: 0,
    incorrectCount: 0,
    score: 0,
  });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [progress, setProgress] = useState(100); // Progress based on time

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions || []);
    };
    fetchDataQuiz();

    // Khôi phục bài làm từ LocalStorage
    const savedAnswers = localStorage.getItem("userAnswers");
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, [id]);

  useEffect(() => {
    // Cập nhật tiến trình thời gian
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cập nhật thanh tiến trình dựa trên thời gian còn lại
    setProgress(Math.round((timeLeft / 600) * 100)); // 600 là tổng thời gian ban đầu (10 phút)
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
    setIsModalVisible(true);
    setIsSubmitted(true);

    // Xóa trạng thái bài làm khi đã nộp
    localStorage.removeItem("userAnswers");
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalVisible(false);
    calculateResults();
  };

  const handleCancelSubmit = () => {
    setIsConfirmModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate("/");
  };

  const handleMarkQuestion = (index) => {
    setMarkedQuestions((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
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
          {quiz[currentIndex]?.answers.map((answer, index) => (
            <div
              key={index}
              className={`answer ${
                isSubmitted &&
                userAnswers[currentIndex] === index &&
                index === quiz[currentIndex]?.correctAnswer
                  ? "correct"
                  : ""
              } ${
                isSubmitted &&
                userAnswers[currentIndex] === index &&
                index !== quiz[currentIndex]?.correctAnswer
                  ? "incorrect"
                  : ""
              }`}
            >
              <Checkbox
                checked={userAnswers[currentIndex] === index}
                onChange={() => handleSelectAnswer(currentIndex, index)}
                disabled={isSubmitted}
              >
                {answer}
              </Checkbox>
            </div>
          ))}
        </div>

        <Button
          disabled={isSubmitted}
          onClick={() => handleMarkQuestion(currentIndex)}
          className="marked-button"
        >
          {markedQuestions.includes(currentIndex) ? "Bỏ đánh dấu" : "Đánh dấu"}
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
        <Button
          type="primary"
          onClick={handleSubmitQuiz}
          disabled={isSubmitted}
        >
          Nộp bài
        </Button>
      </div>

      <Modal
        title="Kết quả bài thi"
        open={isModalVisible}
        onOk={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>
          Số câu đúng: {quizResult.correctCount} <br />
          Số câu sai: {quizResult.incorrectCount} <br />
          Điểm của bạn: {quizResult.score} / 100
        </p>
      </Modal>

      <Modal
        title="Xác nhận nộp bài"
        open={isConfirmModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      >
        <p>Bạn vẫn còn câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?</p>
      </Modal>
    </div>
  );
};

export default Quiz;
