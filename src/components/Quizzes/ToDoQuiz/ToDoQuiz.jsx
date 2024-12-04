import { useParams } from "react-router-dom";
import { Checkbox, Pagination, Button, Modal } from "antd";
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
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Modal xác nhận
  const [quizResult, setQuizResult] = useState({
    correctCount: 0,
    incorrectCount: 0,
    score: 0,
  });

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions || []);
    };
    fetchDataQuiz();
  }, [id]);

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
    const unansweredQuestions = quiz.filter(
      (_, index) => userAnswers[index] === undefined
    );

    // Nếu chưa trả lời hết câu hỏi, hiển thị modal xác nhận
    if (unansweredQuestions.length > 0) {
      setIsConfirmModalVisible(true);
      return;
    }

    // Nếu đã trả lời hết, tính kết quả
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

  const handleOk = () => {
    setIsModalVisible(false);
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
          color="default"
          variant="filled"
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
        <Button
          type="primary"
          onClick={handleSubmitQuiz}
          disabled={isSubmitted}
        >
          Nộp bài
        </Button>
      </div>

      {/* Modal hiển thị kết quả */}
      <Modal
        title="Kết quả bài thi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xem lại"
      >
        <p>
          Số câu đúng: {quizResult.correctCount} <br />
          Số câu sai: {quizResult.incorrectCount} <br />
          Điểm của bạn: {quizResult.score} / 100
        </p>
      </Modal>

      {/* Modal xác nhận nộp bài */}
      <Modal
        title="Xác nhận nộp bài"
        open={isConfirmModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        okText="Tiếp tục nộp"
        cancelText="Quay lại"
      >
        <p>Bạn vẫn còn câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?</p>
      </Modal>
    </div>
  );
};

export default Quiz;
