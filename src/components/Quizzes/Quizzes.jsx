import { Card, Col, Row, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes, deleteQuiz } from "../../services/apiServices";
import { motion } from "framer-motion"; // Import motion từ framer-motion
import "./Quizzes.scss";

const ShowQuiz = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gameId, setGameId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Lưu thông tin bài thi được chọn

  const fetchQuizzes = async () => {
    const data = await getQuizzes();
    setQuizzes(data);
    console.log("DU LIEU CAU HOI: ", data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleNavigate = () => {
    if (selectedQuiz) {
      navigate(`/admin/game/${gameId}`, {
        state: { quiz: selectedQuiz, gameId, quizId: selectedQuiz._id },
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

  const handleDeleteQuiz = async (id) => {
    const res = await deleteQuiz(id);
    if (res && res.message) {
      message.success(res.message);
      setQuizzes("");
      fetchQuizzes();
    }
  };

  return (
    <Row gutter={16} className={"show-quiz"}>
      {quizzes?.quizzes?.map((quiz, index) => (
        <Col
          key={index}
          xs={24}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className={"quiz-card"}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }} // Thêm độ trễ cho từng phần tử
          >
            <Card title={quiz.title} bordered={false} className="card">
              <div className="description-quiz">
                <span>Mô tả: </span> {quiz.description}
              </div>
              <div>
                <div className="btn-public">
                  <Button onClick={() => handleOpenModal(quiz)}>Public</Button>
                </div>
                <div className="btn-delete">
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    Xoá bài thi
                  </Button>
                </div>
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
          </motion.div>
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
            placeholder="Nhập ID"
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
