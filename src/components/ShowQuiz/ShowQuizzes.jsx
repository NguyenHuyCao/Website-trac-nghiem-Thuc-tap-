import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes } from "../../services/apiServices";
import "./ShowQuizzes.scss"; // Import SCSS module

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
      {quizzes?.quizzes?.map((quiz, index) => (
        <Col
          key={index}
          span={8}
          className={"quiz-card"}
          onClick={() => navigate(`/show-quiz/${quiz._id}`)}
        >
          <Card title={quiz.title} bordered={false}>
            {quiz.description}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ShowQuiz;
