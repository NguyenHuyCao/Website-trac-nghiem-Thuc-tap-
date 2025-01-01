// import { useParams } from "react-router-dom";
// import "./Quiz.scss";
// import { Checkbox, Pagination, Button } from "antd";
// import { useEffect, useState } from "react";
// import { getDataQuiz } from "../../../services/apiServices";
// import BasicModal from "../../Modal/BasicModal";
// import EditQuestion from "../../Function/Question/EditQuestion";

// const Quiz = () => {
//   const { id } = useParams();
//   const [quiz, setQuiz] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchDataQuiz = async () => {
//       const data = await getDataQuiz(id);
//       setQuiz(data.questions || []);
//     };
//     fetchDataQuiz();
//   }, [id]);

//   if (!quiz || quiz.length === 0) {
//     return <div>Not data</div>;
//   }

//   const handlePaginationChange = (e) => {
//     setCurrentIndex(e - 1);
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentIndex(index);
//   };

//   const handleOpenAddModal = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleCloseAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   const handleEditQuestion = (updatedQuestion) => {
//     const updatedQuiz = [...quiz];
//     updatedQuiz[currentIndex] = updatedQuestion;
//     setQuiz(updatedQuiz);
//     handleCloseAddModal();
//   };

//   return (
//     <div className="container-quiz">
//       {!quiz || quiz.length === 0 ? (
//         <div>Not data</div>
//       ) : (
//         <>
//           <div className="table-questions">
//             <h1>Bản câu hỏi</h1>
//             <div className="number-questions">
//               {quiz.map((q, index) => {
//                 return (
//                   <div
//                     key={q._id}
//                     className={currentIndex === index ? "active" : ""}
//                     onClick={() => handleQuestionClick(index)}
//                   >
//                     {index + 1}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="detail-quiz">
//             <div className="question-quiz">
//               <h2>
//                 Câu hỏi {currentIndex + 1}: {quiz[currentIndex]?.question}
//               </h2>
//             </div>
//             <div className="answers-quiz">
//               {quiz[currentIndex]?.answers.map((answer, index) => {
//                 return (
//                   <div key={index}>
//                     <Checkbox
//                       checked={quiz[currentIndex]?.correctAnswer === index}
//                     >
//                       <p className="answer-quiz">{answer}</p>
//                     </Checkbox>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="paginate-quiz">
//               <Pagination
//                 defaultCurrent={1}
//                 total={quiz.length * 10}
//                 onChange={handlePaginationChange}
//               />
//             </div>
//             <Button type="primary" onClick={handleOpenAddModal}>
//               Chỉnh sửa câu hỏi
//             </Button>

//             <Button type="primary" onClick={handleOpenAddModal}>
//               Thêm câu hỏi
//             </Button>
//           </div>
//         </>
//       )}
//       <BasicModal isOpen={isAddModalOpen} onRequestClose={handleCloseAddModal}>
//         <EditQuestion
//           question={quiz[currentIndex]}
//           quizId={id}
//           onSave={handleEditQuestion}
//           onClose={handleCloseAddModal}
//         />
//       </BasicModal>
//     </div>
//   );
// };

// export default Quiz;

import { useParams } from "react-router-dom";
import "./Quiz.scss";
import { Checkbox, Pagination, Button } from "antd";
import { useEffect, useState } from "react";
import { getDataQuiz } from "../../../services/apiServices";
import BasicModal from "../../Modal/BasicModal";
import EditQuestion from "../../Function/Question/EditQuestion";
import AddQuestion from "../../Function/Question/AddQuestion"; // Import AddQuestion

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchDataQuiz = async () => {
      const data = await getDataQuiz(id);
      setQuiz(data.questions || []);
    };
    fetchDataQuiz();
  }, [id]);

  if (!quiz || quiz.length === 0) {
    return <div>Not data</div>;
  }

  const handlePaginationChange = (e) => {
    setCurrentIndex(e - 1);
  };

  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditQuestion = (updatedQuestion) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[currentIndex] = updatedQuestion;
    setQuiz(updatedQuiz);
    handleCloseEditModal();
  };

  const handleAddQuestion = (newQuestion) => {
    const updatedQuiz = [...quiz, newQuestion];
    setQuiz(updatedQuiz);
    handleCloseAddModal();
  };

  return (
    <div className="container-quiz">
      {!quiz || quiz.length === 0 ? (
        <div>Not data</div>
      ) : (
        <>
          <div className="table-questions">
            <h1>Bảng câu hỏi</h1>
            <div className="number-questions">
              {quiz.map((q, index) => {
                return (
                  <div
                    key={q._id}
                    className={currentIndex === index ? "active" : ""}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>

            <Button
              className="btn-add-question"
              type="primary"
              onClick={handleOpenAddModal}
            >
              Thêm câu hỏi
            </Button>
          </div>
          <div className="detail-quiz">
            <div className="question-quiz">
              <h2>
                Câu hỏi {currentIndex + 1}: {quiz[currentIndex]?.question}
              </h2>
            </div>
            <div className="answers-quiz">
              {quiz[currentIndex]?.answers.map((answer, index) => {
                return (
                  <div key={index}>
                    <Checkbox
                      checked={quiz[currentIndex]?.correctAnswer === index}
                    >
                      <p className="answer-quiz">{answer}</p>
                    </Checkbox>
                  </div>
                );
              })}
            </div>
            <Button
              className="edit-question"
              type="primary"
              onClick={handleOpenEditModal}
            >
              Chỉnh sửa câu hỏi
            </Button>
            <div className="paginate-quiz">
              <Pagination
                defaultCurrent={1}
                total={quiz.length * 10}
                onChange={handlePaginationChange}
              />
            </div>
          </div>
        </>
      )}
      {/* Modal chỉnh sửa câu hỏi */}
      <BasicModal
        isOpen={isEditModalOpen}
        onRequestClose={handleCloseEditModal}
      >
        <EditQuestion
          question={quiz[currentIndex]}
          quizId={id}
          onSave={handleEditQuestion}
          onClose={handleCloseEditModal}
        />
      </BasicModal>

      {/* Modal thêm câu hỏi */}
      <BasicModal isOpen={isAddModalOpen} onRequestClose={handleCloseAddModal}>
        <AddQuestion
          quizId={id}
          onSave={handleAddQuestion}
          onClose={handleCloseAddModal}
        />
      </BasicModal>
    </div>
  );
};

export default Quiz;
