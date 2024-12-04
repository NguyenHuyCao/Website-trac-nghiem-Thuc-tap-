import axios from "../utils/axiosCustomize";
// import axios from "axios";

const postCreateNewQuiz = (title, description, questions) => {
  return axios.post(
    "api/v1/quizz/add",
    {
      title: title,
      description: description,
      questions: questions,
    },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
};

const getQuizzes = () => {
  return axios.get("api/v1/quizz/quizzes");
};

const getDataQuiz = (id) => {
  return axios.get(`api/v1/quizz/quizzes/${id}/questions`);
};

export { postCreateNewQuiz, getQuizzes, getDataQuiz };
