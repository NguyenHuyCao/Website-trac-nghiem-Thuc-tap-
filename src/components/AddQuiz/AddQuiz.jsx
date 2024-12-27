import { Button, Input, Select, notification } from "antd";
import { IoMdAdd } from "react-icons/io";
import "./AddQuiz.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz } from "../../features/quizz/quizzSlice"; // Import the addQuiz thunk
import { toast } from "react-toastify";

const AddQuiz = () => {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [{ question: "", answers: ["", "", "", ""], correctAnswer: 0 }],
    duration: "", // Thay đổi ở đây: giá trị mặc định là chuỗi rỗng
  });

  const dispatch = useDispatch();
  const { addQuizLoading, addQuizError } = useSelector((state) => state.quiz);

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", answers: ["", "", "", ""], correctAnswer: 0 },
      ],
    });
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex
        ? {
            ...q,
            answers: q.answers.map((a, j) => (j === aIndex ? value : a)),
          }
        : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, correctAnswer: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (qIndex) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== qIndex);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuiz({ ...quiz, duration: value });
    }
  };

  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      toast.error("Yêu cầu nhập tiêu đề bài thi");
      return false;
    }

    if (quiz.duration <= 0) {
      toast.error("Thời gian làm bài phải lớn hơn 0");
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      if (!question.question.trim()) {
        toast.error(`Yêu cầu nhập nội dung cho câu hỏi ${i + 1}`);
        return false;
      }

      for (let j = 0; j < question.answers.length; j++) {
        if (!question.answers[j].trim()) {
          toast.error(
            `Yêu cầu nhập nội dung cho đáp án ${j + 1} của câu hỏi ${i + 1}`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateQuiz()) return;

    try {
      // Dispatch the addQuiz action
      await dispatch(addQuiz(quiz));
      // Thông báo thành công khi lưu bài thi
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu bài thi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="add-quiz">
      <h1>Thêm bài thi</h1>

      <div className="quiz-info">
        <label>
          Tên bài thi<span style={{ color: "red" }}>*</span>:
          <Input
            placeholder="Tiêu đề bài thi"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
        </label>
        <label>
          Mô tả bài thi:
          <Input
            placeholder="Mô tả bài thi"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />
        </label>
        <label>
          Thời gian làm bài (giây):
          <Input
            type="number"
            // min="0"
            placeholder="Nhập thời gian làm bài"
            value={quiz.duration}
            onChange={handleDurationChange}
          />
        </label>
      </div>

      <div className="questions">
        <h2>Câu hỏi</h2>
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question">
            <label>
              Câu hỏi {qIndex + 1}:
              <Input
                placeholder="Nhập nội dung câu hỏi"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />
            </label>
            <div className="answers">
              {q.answers.map((a, aIndex) => (
                <label key={aIndex}>
                  <Input
                    placeholder={`Đáp án ${aIndex + 1}`}
                    value={a}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Đáp án đúng:
              <Select
                value={q.correctAnswer}
                onChange={(value) => handleCorrectAnswerChange(qIndex, value)}
                style={{ width: 200 }}
                placeholder="Chọn đáp án đúng"
                options={q.answers.map((_, index) => ({
                  value: index,
                  label: `Đáp án ${index + 1}`,
                }))}
              />
            </label>
            {quiz.questions.length > 1 && (
              <Button
                type="primary"
                onClick={() => handleDeleteQuestion(qIndex)}
                danger
              >
                Xóa câu hỏi
              </Button>
            )}
          </div>
        ))}
        <Button onClick={handleAddQuestion}>
          <IoMdAdd />
          Thêm câu hỏi
        </Button>
      </div>

      <Button
        type="primary"
        className="submit-btn"
        onClick={handleSubmit}
        block
        loading={addQuizLoading} // Show loading state while adding quiz
      >
        Lưu bài thi
      </Button>

      {addQuizError && (
        <notification message="Lỗi" description={addQuizError} type="error" />
      )}
    </div>
  );
};

export default AddQuiz;
