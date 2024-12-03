import { Button, Input, Select } from "antd";
import { IoMdAdd } from "react-icons/io";
import "./AddQuiz.scss";
import { useState } from "react";
import axios from "axios";

const AddQuiz = () => {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [{ question: "", answers: ["", "", "", ""], correctAnswer: 0 }],
  });
  const [error, setError] = useState("");

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

  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      setError("Yêu cầu nhập tiêu đề bài thi");
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      if (!question.question.trim()) {
        setError(`Yêu cầu nhập nội dung cho câu hỏi ${i + 1}`);
        return false;
      }

      for (let j = 0; j < question.answers.length; j++) {
        if (!question.answers[j].trim()) {
          setError(
            `Yêu cầu nhập nội dung cho đáp án ${j + 1} của câu hỏi ${i + 1}`
          );
          return false;
        }
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateQuiz()) return;

    try {
      const response = await axios.post(
        "https://quizzlet-19y7.onrender.com/api/v1/quizz/add",
        {
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Response:", response.data);
      alert("Bài thi đã được lưu thành công!");

      // Reset form
      setQuiz({
        title: "",
        description: "",
        questions: [
          { question: "", answers: ["", "", "", ""], correctAnswer: 0 },
        ],
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError("Đã xảy ra lỗi khi lưu bài thi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="add-quiz">
      <h1>Thêm bài thi</h1>
      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
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
            <Button
              type="primary"
              onClick={() => handleDeleteQuestion(qIndex)}
              danger
            >
              Xóa câu hỏi
            </Button>
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
      >
        Lưu bài thi
      </Button>
    </div>
  );
};

export default AddQuiz;
