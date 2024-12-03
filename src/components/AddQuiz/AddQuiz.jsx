import { Button, Flex, Input, Select } from "antd";
import { IoMdAdd } from "react-icons/io";
import "./AddQuiz.scss";
import { useState } from "react";
// import { postCreateNewQuiz } from "../../services/apiServices";
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
    console.log(value);
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, correctAnswer: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (qIndex) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== qIndex);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    console.log("Quiz Submitted:", quiz);
    if (!quiz.title) {
      setError("Yêu cầu nhập tiêu đề bài thi");
      return;
    }
    if (quiz.questions && quiz.questions.length > 0) {
      quiz.questions.map((q, qindex) => {
        if (!q.question) {
          setError(`Yêu cầu nhập tiêu đề cho câu hỏi ${qindex + 1}`);
          return;
        }

        q.answers.map((a, aindex) => {
          if (!a || a.trim() === "") {
            setError(
              `Yêu cầu nhập đáp án ${aindex + 1} cho câu hỏi ${qindex + 1}`
            );
            return;
          }
        });
      });
    } else {
      setError("Yêu cầu tạo câu hỏi cho bài thi");
      return;
    }

    await axios.post(
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

    // const formData = new FormData();
    // formData.append("title", quiz.title);
    // formData.append("description", quiz.description);
    // formData.append("questions", JSON.stringify(quiz.questions));

    // await axios
    //   .post("https://quizzlet-19y7.onrender.com/api/v1/quizz/add", formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //     withCredentials: true,
    //   })
    //   .then((response) => console.log(response.data))
    //   .catch((error) => console.error(error.response?.data || error.message));
    // // await postCreateNewQuiz(quiz.title, quiz.description, quiz.questions);
  };

  console.log(error);

  return (
    <div className="add-quiz">
      <h1>Thêm bài thi</h1>
      <div className="quiz-info">
        <label>
          Tên bài thi<span style={{ color: "red" }}>*</span>:
          <Flex vertical gap={12}>
            <Input
              placeholder="Tiêu đề bài thi"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </Flex>
        </label>
        <label>
          Mô tả bài thi:
          <Flex vertical gap={12}>
            <Input
              placeholder="Mô tả bài thi"
              variant="filled"
              value={quiz.description}
              onChange={(e) =>
                setQuiz({ ...quiz, description: e.target.value })
              }
            />
          </Flex>
        </label>
      </div>
      <div className="questions">
        <h2>Câu hỏi</h2>
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question">
            <label>
              Câu hỏi {qIndex + 1}:
              <Flex vertical gap={12}>
                <Input
                  placeholder="Nhập tên câu hỏi"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
              </Flex>
            </label>
            <div className="answers">
              {q.answers.map((a, aIndex) => (
                <label key={aIndex}>
                  <Flex vertical gap={12}>
                    <Input
                      placeholder={`Đáp án ${aIndex + 1}:`}
                      value={a}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                    />
                  </Flex>
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
                options={q.answers.map((answer, index) => ({
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
