import { Card, Col, Row, Button, Modal, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes } from "../../services/apiServices";
import "./Quizzes.scss";

const ShowQuiz = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gameId, setGameId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Lưu thông tin bài thi được chọn

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getQuizzes();
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const handleNavigate = () => {
    if (selectedQuiz) {
      navigate(`/admin/game/${gameId}`, {
        state: { quiz: selectedQuiz, gameId },
      });
    }
  };

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz); // Đặt bài thi được chọn
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setGameId(""); // Xóa dữ liệu sau khi đóng modal
    setSelectedQuiz(null);
  };

  return (
    <Row gutter={16} className={"show-quiz"}>
      {quizzes?.quizzes?.map((quiz, index) => (
        <Col key={index} span={8} className={"quiz-card"}>
          <Card title={quiz.title} bordered={false} className="card">
            <div>
              <span>Mô tả: </span> {quiz.description}
            </div>
            <div>
              <Button onClick={() => handleOpenModal(quiz)}>Public</Button>
            </div>
            <div className="quiz-actions">
              <Button onClick={() => navigate(`/show-quiz/${quiz._id}`)}>
                Xem bài thi
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/home-exam/${quiz._id}`, { state: quiz })
                }
              >
                Làm bài
              </Button>
            </div>
          </Card>
        </Col>
      ))}

      <Modal
        title="Public bài thi"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <Input
            placeholder="Nhập Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            onClick={handleNavigate}
            style={{ marginRight: "10px" }}
            disabled={!gameId || !selectedQuiz}
          >
            Go to
          </Button>
          <Button onClick={handleCloseModal}>Huỷ</Button>
        </div>
      </Modal>
    </Row>
  );
};

export default ShowQuiz;
