import { Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { getQuizzes } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getQuizzes();

      setQuizzes(data.quizzes);
    };
    fetchQuizzes();
  }, []);
  // console.log(quizzes);

  const handleSearch = (value) => {
    if (!value) {
      message.warning("Vui lòng nhập ID bài Quiz!");
      return;
    }

    if (!quizzes || quizzes.length < 1) {
      message.warning("Không tồn tại bài Quiz nào!");
      return;
    }

    setIsLoading(true);

    const currentQuiz = quizzes.filter((q) => q._id === value);

    if (!currentQuiz || currentQuiz.length !== 1) {
      setIsLoading(false);
      message.error(`Không tồn tại bài Quiz có ID là: ${value}`);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      message.success(`Tìm kiếm thành công với ID: ${value}`);
      navigate(`/exam/${value}`);
    }, 3000);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Tìm kiếm bài Quiz</h1>
      <Search
        placeholder="Nhập ID bài Quiz"
        enterButton="Tìm"
        size="large"
        loading={isLoading}
        onSearch={handleSearch}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ width: 300 }}
      />
      <div style={{ marginTop: "20px" }}>
        {isLoading && <Spin size="large" />}
      </div>
    </div>
  );
};

export default Home;
