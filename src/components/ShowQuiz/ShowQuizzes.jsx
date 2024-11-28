import { Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

const ShowQuiz = () => {
  const navigate = useNavigate();
  const quizzes = [
    {
      id: 1,
      title: "Quiz về Khoa học",
      description: "Kiểm tra kiến thức cơ bản về khoa học tự nhiên.",
      questions: [
        {
          id: 101,
          question: "Nước có công thức hóa học là gì?",
          answers: ["H2O", "CO2", "O2", "N2"],
          correctAnswer: 0,
        },
        {
          id: 102,
          question: "Tốc độ ánh sáng là bao nhiêu?",
          answers: [
            "300,000 km/s",
            "150,000 km/s",
            "1,000 km/s",
            "10,000 km/s",
          ],
          correctAnswer: 0,
        },
        {
          id: 103,
          question: "Nguyên tố nào có ký hiệu hóa học là O?",
          answers: ["Oxi", "Vàng", "Kẽm", "Niken"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 2,
      title: "Quiz về Lịch sử",
      description: "Câu hỏi lịch sử Việt Nam và thế giới.",
      questions: [
        {
          id: 201,
          question: "Chiến tranh thế giới thứ hai kết thúc năm nào?",
          answers: ["1945", "1939", "1950", "1918"],
          correctAnswer: 0,
        },
        {
          id: 202,
          question: "Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?",
          answers: ["Hai Bà Trưng", "Ngô Quyền", "Trần Hưng Đạo", "Lý Thái Tổ"],
          correctAnswer: 0,
        },
        {
          id: 203,
          question: "Nhà nước Văn Lang do ai sáng lập?",
          answers: ["Hùng Vương", "Lý Công Uẩn", "Ngô Quyền", "Trần Nhân Tông"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 3,
      title: "Quiz về Công nghệ thông tin",
      description: "Kiến thức cơ bản về lập trình và công nghệ thông tin.",
      questions: [
        {
          id: 301,
          question:
            "Ngôn ngữ lập trình nào sau đây được sử dụng để xây dựng trang web?",
          answers: ["HTML", "Python", "C++", "Java"],
          correctAnswer: 0,
        },
        {
          id: 302,
          question: "Giao thức HTTP là viết tắt của?",
          answers: [
            "HyperText Transfer Protocol",
            "Hyperlink Text Protocol",
            "Hyper Transfer Text Program",
            "Hyperlink Transfer Program",
          ],
          correctAnswer: 0,
        },
        {
          id: 303,
          question: "Công cụ nào sau đây dùng để quản lý mã nguồn?",
          answers: ["Git", "Excel", "Photoshop", "Word"],
          correctAnswer: 0,
        },
      ],
    },
  ];

  return (
    <Row gutter={16} style={{ marginTop: "50px" }}>
      {quizzes &&
        quizzes.map((quiz, index) => {
          return (
            <Col
              style={{ marginTop: "20px", cursor: "pointer" }}
              key={index}
              span={8}
              onClick={() => navigate(`/show-quiz/${quiz.id}`)}
            >
              <Card title={quiz.title} bordered={false}>
                {quiz.description}
              </Card>
            </Col>
          );
        })}
    </Row>
  );
};

export default ShowQuiz;
