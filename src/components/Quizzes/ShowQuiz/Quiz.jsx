import { useParams } from "react-router-dom";
import "./Quiz.scss";
import { Checkbox, Pagination } from "antd";
import { useEffect, useState } from "react";
import { getDataQuiz } from "../../../services/apiServices";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handlePaginationChange = (e) => {
    setCurrentIndex(e - 1);
  };

  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="container-quiz">
      {!quiz || quiz.length === 0 ? (
        <div>Not data</div>
      ) : (
        <>
          <div className="table-questions">
            <h1>Bản câu hỏi</h1>
            <div className="number-questions">
              {quiz.map((q, index) => {
                return (
                  <div
                    key={q._id}
                    className={currentIndex === index ? "active" : ""}
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
                return (
                  <div key={index}>
                    <Checkbox
                      checked={quiz[currentIndex]?.correctAnswer === index}
                    >
                      <p className="answer-quiz">{answer}</p>
                    </Checkbox>
                  </div>
                );
              })}
            </div>
            <div className="paginate-quiz">
              <Pagination
                defaultCurrent={1}
                total={quiz.length * 10}
                onChange={handlePaginationChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
