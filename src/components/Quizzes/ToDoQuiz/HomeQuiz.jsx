import { Button } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./HomeQuiz.scss";

const HomeQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  return (
    <div className="home-quiz-container">
      <div>
        <h1 className="title-quiz">{location.state.title}</h1>
        <p className="description-quiz">{location.state.description}</p>
        <p className="number-questions">
          Số câu hỏi: {location.state.questions.length}
        </p>
      </div>

      <Button
        className="quiz-button start-btn"
        onClick={() => navigate(`/home-exam/${id}/exam`)}
      >
        Bắt đầu
      </Button>
      <Button className="quiz-button back-btn" onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default HomeQuiz;
