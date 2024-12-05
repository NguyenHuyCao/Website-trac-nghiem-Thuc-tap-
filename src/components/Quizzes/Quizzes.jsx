import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes } from "../../services/apiServices";
import "./Quizzes.scss";
import { Button, Flex } from "antd";
import { QRCode } from "antd";

const ShowQuiz = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getQuizzes();
      // console.log(data);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  return (
    <Row gutter={16} className={"show-quiz"}>
      {quizzes?.quizzes?.map((quiz, index) => {
        console.log(quiz);
        return (
          <Col key={index} span={8} className={"quiz-card"}>
            <Card title={quiz.title} bordered={false} className="card">
              <div>
                <span>Mô tả: </span> {quiz.description}
              </div>
              <div>
                <span>Mã bài thi:</span> {quiz._id}
              </div>
              <div>
                <span>Mã QR: </span>{" "}
                <QRCode value={`http://localhost:5050/home-exam/${quiz._id}`} />
              </div>
              <Flex gap="small" wrap>
                <Button
                  // type="primary"
                  onClick={() => navigate(`/show-quiz/${quiz._id}`)}
                >
                  Xem bài thi
                </Button>
                <Button
                  type="primary"
                  // danger
                  onClick={() =>
                    navigate(`/home-exam/${quiz._id}`, { state: quiz })
                  }
                >
                  Làm bài
                </Button>
              </Flex>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ShowQuiz;
