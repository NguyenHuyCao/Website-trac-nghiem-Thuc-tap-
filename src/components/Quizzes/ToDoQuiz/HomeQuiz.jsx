import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./HomeQuiz.scss"; // Đảm bảo import file SCSS

const HomeQuiz = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate từ v6
  const { id } = useParams();

  return (
    <div className="home-quiz-container">
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
