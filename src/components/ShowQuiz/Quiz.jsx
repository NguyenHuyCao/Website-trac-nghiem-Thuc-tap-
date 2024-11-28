import { useParams } from "react-router-dom";
import "./Quiz.scss";
import { Checkbox, Pagination } from "antd";
import { useState } from "react";

const Quiz = () => {
  const { id } = useParams();
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
          correctAnswer: 2,
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
          correctAnswer: 1,
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
          correctAnswer: 2,
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
          correctAnswer: 1,
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
          correctAnswer: 3,
        },
      ],
    },
  ];

  const quiz = quizzes?.filter((quiz) => +quiz.id === +id)[0];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (quiz.questions && quiz.questions.length < 1)
    return (
      <>
        <div>Not data</div>
      </>
    );

  const handleOnChane = (e) => {
    setCurrentIndex(e - 1);
  };

  return (
    <div className="container-quiz">
      <div className="header-quiz">
        <h1 className="title-quiz">Bài thi: {quiz.title}</h1>
      </div>

      <div className="detail-quiz">
        <div className="question-quiz">
          Câu hỏi {currentIndex + 1}: {quiz.questions[currentIndex].question}
        </div>
        <div className="answers-quiz">
          {quiz.questions[currentIndex].answers.map((answer, index) => {
            return (
              <div key={index}>
                <Checkbox
                  checked={quiz.questions[currentIndex].correctAnswer === index}
                >
                  <p className="answer-quiz">{answer}</p>
                </Checkbox>
              </div>
            );
          })}
        </div>
        <div className="paginate-quiz">
          <Pagination
            align="center"
            defaultCurrent={1}
            total={quiz.questions.length * 10}
            onChange={handleOnChane}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
