import { useParams } from "react-router-dom";
import { Checkbox, Pagination, Button, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { getDataQuiz } from "../../../services/apiServices";
import "./ToDoQuiz.scss";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions || []);
    };
    fetchDataQuiz();
  }, [id]);

  if (!quiz || quiz.length === 0) {
    return <div>Not data</div>;
  }

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

    if (unansweredQuestions.length > 0) {
      setIsModalVisible(true);
      return;
    }

    const results = quiz.map((question, index) => ({
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswers[index] !== undefined ? userAnswers[index] : null,
      isCorrect: userAnswers[index] === question.correctAnswer,
    }));

    const correctCount = results.filter((result) => result.isCorrect).length;
    const incorrectCount = results.length - correctCount;

    message.success(
      `Bạn đã hoàn thành bài thi! Đúng: ${correctCount} - Sai: ${incorrectCount}`
    );
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    const results = quiz.map((question, index) => ({
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswers[index] !== undefined ? userAnswers[index] : null,
      isCorrect: userAnswers[index] === question.correctAnswer,
    }));

    const correctCount = results.filter((result) => result.isCorrect).length;
    const incorrectCount = results.length - correctCount;

    message.success(
      `Bạn đã hoàn thành bài thi! Đúng: ${correctCount} - Sai: ${incorrectCount}`
    );

    setIsSubmitted(true);
    setIsModalVisible(false);
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
                  isSubmitted
                    ? isCorrect
                      ? "correct"
                      : // : isIncorrect
                        "incorrect"
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
                    } ${isIncorrect && isSubmitted ? "incorrect-answer" : ""}`}
                  >
                    {answer}{" "}
                    {isCorrect && isSubmitted && (
                      <span className="check-icon">✔️</span>
                    )}
                    {isIncorrect && isSubmitted && (
                      <span className="check-icon">❌</span>
                    )}
                  </p>
                </Checkbox>
              </div>
            );
          })}
        </div>
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

      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Nộp bài"
        cancelText="Quay lại làm tiếp"
      >
        <p>
          Vẫn còn câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài không?
        </p>
      </Modal>
    </div>
  );
};

export default Quiz;
