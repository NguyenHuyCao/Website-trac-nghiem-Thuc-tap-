import { Button, Input, Select } from "antd";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { addQuestion } from "../../../features/quizz/quizzSlice";
import "./AddQuestion.scss";

const AddQuestion = ({ quizId, onSave, onClose }) => {
  console.log("ID bên thêm câu hỏi: ", quizId);
  const dispatch = useDispatch();
  const [questionData, setQuestionData] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
  });

  const handleQuestionChange = (value) => {
    setQuestionData({ ...questionData, question: value });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...questionData.answers];
    updatedAnswers[index] = value;
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const handleCorrectAnswerChange = (value) => {
    setQuestionData({ ...questionData, correctAnswer: value });
  };

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [...questionData.answers, ""],
    });
  };

  const handleDeleteAnswer = (index) => {
    const updatedAnswers = questionData.answers.filter((_, i) => i !== index);
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const validateQuestion = () => {
    if (!questionData.question.trim()) {
      alert("Yêu cầu nhập nội dung câu hỏi!");
      return false;
    }

    if (questionData.answers.length < 2) {
      alert("Cần có ít nhất 2 đáp án!");
      return false;
    }

    for (let i = 0; i < questionData.answers.length; i++) {
      if (!questionData.answers[i].trim()) {
        alert(`Yêu cầu nhập nội dung cho đáp án ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    console.log("Dữ liệu để thêm câu hỏi: ", questionData);
    if (!validateQuestion()) return;

    dispatch(addQuestion({ quizId, questionData }));

    if (onClose) {
      onClose(); // Đóng modal sau khi lưu
    }
  };

  return (
    <div className="add-question">
      <h2 className="add-question__title">Thêm câu hỏi</h2>

      <label className="add-question__label">
        Nội dung câu hỏi:
        <Input
          className="add-question__input"
          placeholder="Nhập nội dung câu hỏi"
          value={questionData.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
        />
      </label>

      <div className="add-question__answers">
        <h3 className="add-question__answers-title">Đáp án</h3>
        {questionData.answers.map((answer, index) => (
          <div key={index} className="add-question__answer-item">
            <Input
              className="add-question__answer-input"
              placeholder={`Đáp án ${index + 1}`}
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
            <Button
              className="add-question__delete-btn"
              type="primary"
              danger
              onClick={() => handleDeleteAnswer(index)}
              disabled={questionData.answers.length <= 2}
            >
              Xóa
            </Button>
          </div>
        ))}
        <Button
          className="add-question__add-answer-btn"
          onClick={handleAddAnswer}
        >
          <IoMdAdd />
          Thêm đáp án
        </Button>
      </div>

      <label className="add-question__label">
        Đáp án đúng:
        <Select
          className="add-question__select"
          value={questionData.correctAnswer}
          onChange={handleCorrectAnswerChange}
          placeholder="Chọn đáp án đúng"
          options={questionData.answers.map((_, index) => ({
            value: index,
            label: `Đáp án ${index + 1}`,
          }))}
          getPopupContainer={(trigger) => trigger.parentElement}
        />
      </label>

      <div className="add-question__buttons">
        <Button
          className="add-question__save-btn"
          type="primary"
          onClick={handleSave}
        >
          Lưu
        </Button>
        <Button className="add-question__cancel-btn" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default AddQuestion;
