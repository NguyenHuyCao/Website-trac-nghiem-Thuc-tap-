import { useState } from "react";
import { Input, Select, Button } from "antd";
import { IoMdAdd } from "react-icons/io";

import { useDispatch } from "react-redux";
import { editQuiz } from "../../../features/quizz/quizzSlice";
import "./EditQuestion.scss";

const EditQuestion = ({ quizId, question, onSave, onClose }) => {
  console.log(question._id);
  const dispatch = useDispatch();
  const [editedQuestion, setEditedQuestion] = useState({
    ...question,
    correctAnswer: question.correctAnswer ?? 0,
  });

  const handleQuestionChange = (value) => {
    setEditedQuestion({ ...editedQuestion, question: value });
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...editedQuestion.answers];
    newAnswers[index] = value;
    setEditedQuestion({ ...editedQuestion, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (value) => {
    setEditedQuestion({ ...editedQuestion, correctAnswer: value });
  };

  const handleAddAnswer = () => {
    const newAnswers = [...editedQuestion.answers, ""];
    setEditedQuestion({ ...editedQuestion, answers: newAnswers });
  };

  const handleDeleteAnswer = (index) => {
    const newAnswers = editedQuestion.answers.filter((_, i) => i !== index);
    let newCorrectAnswer = editedQuestion.correctAnswer;

    // Nếu đáp án đúng bị xóa, điều chỉnh lại đáp án đúng
    if (index === editedQuestion.correctAnswer) {
      newCorrectAnswer = -1; // Không có đáp án đúng nếu đáp án đúng bị xóa
    } else if (index < editedQuestion.correctAnswer) {
      newCorrectAnswer -= 1; // Dịch đáp án đúng về trước nếu xóa đáp án trước đó
    }

    setEditedQuestion({
      ...editedQuestion,
      answers: newAnswers,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleSave = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (editedQuestion.correctAnswer === -1) {
      alert("Vui lòng chọn đáp án đúng!");
      return;
    }

    const questionId = question._id;
    const questionData = { ...editedQuestion };
    delete questionData._id;

    console.log("Dữ liệu được gửi:", questionData);
    console.log("Dữ liệu quizId ", quizId);
    console.log("Dữ liệu questionId:", questionId);

    await dispatch(editQuiz({ quizId, questionId, questionData }));
    if (onSave) {
      onSave(editedQuestion);
    }
    onClose();
  };

  return (
    <div className="edit-question-container">
      <div className="edit-question">
        <label className="question-label">
          Câu hỏi:
          <Input
            className="question-input"
            placeholder="Nhập nội dung câu hỏi"
            value={editedQuestion?.question || ""}
            onChange={(e) => handleQuestionChange(e.target.value)}
          />
        </label>
        <div className="answers-section">
          <h2 className="answers-header">Danh sách trả lời</h2>
          {editedQuestion?.answers.map((answer, index) => (
            <div key={index} className="answer-item">
              <Input
                className="answer-input"
                placeholder={`Đáp án ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
              <Button
                className="delete-answer-btn"
                type="primary"
                danger
                onClick={() => handleDeleteAnswer(index)}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button className="add-answer-btn" onClick={handleAddAnswer}>
            <IoMdAdd />
            Thêm đáp án
          </Button>
        </div>
        <label className="correct-answer-label">
          Đáp án đúng:
          <Select
            className="correct-answer-select"
            value={editedQuestion.correctAnswer}
            onChange={(value) => handleCorrectAnswerChange(value)}
            placeholder="Chọn đáp án đúng"
            options={editedQuestion.answers.map((_, index) => ({
              value: index,
              label: `Đáp án ${index + 1}`,
            }))}
            getPopupContainer={(trigger) => trigger.parentElement}
          />
        </label>
      </div>
      <div className="button-group">
        <Button className="save-btn" type="primary" onClick={handleSave}>
          Lưu
        </Button>
        <Button className="cancel-btn" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default EditQuestion;
