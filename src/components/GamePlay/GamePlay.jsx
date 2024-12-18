// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Kết nối tới server

// const GamePlay = () => {
//   const { gameId } = useParams(); // Lấy gameId từ URL
//   const { search } = useLocation(); // Lấy search params từ URL
//   const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
//   const [answers, setAnswers] = useState([]); // Mảng lưu câu trả lời của người chơi
//   const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã nộp bài
//   const [result, setResult] = useState(null); // Kết quả từ server
//   const [loading, setLoading] = useState(true); // Trạng thái tải câu hỏi
//   const [timeRemaining, setTimeRemaining] = useState(20); // Thời gian còn lại (giây)

//   const answersRef = useRef([]); // Tham chiếu tới câu trả lời mới nhất
//   const timeLimit = 20; // Thời gian chơi (giây)

//   // Lấy username từ URL search params
//   const params = new URLSearchParams(search);
//   const usernameFromUrl = params.get("username");

//   useEffect(() => {
//     // Yêu cầu câu hỏi từ server
//     socket.emit("play-game", gameId);

//     socket.on("game-questions", (data) => {
//       console.log("Questions received:", data);
//       setQuestions(data.questions);

//       // Lấy câu trả lời đã lưu từ localStorage
//       const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
//       const initialAnswers = data.questions.map((_, index) =>
//         storedAnswers[index] !== undefined ? storedAnswers[index] : null
//       );

//       setAnswers(initialAnswers); // Khôi phục câu trả lời
//       answersRef.current = initialAnswers; // Đồng bộ tham chiếu
//       setLoading(false);
//     });

//     socket.on("game-result", (result) => {
//       console.log("Result received:", result);
//       setResult(result);
//       setIsSubmitted(true);
//     });

//     return () => {
//       socket.off("game-questions");
//       socket.off("game-result");
//     };
//   }, [gameId]);

//   useEffect(() => {
//     if (isSubmitted) return;

//     // Đếm ngược thời gian
//     const countdown = setInterval(() => {
//       setTimeRemaining((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdown);
//           handleSubmit(); // Gọi handleSubmit khi hết thời gian
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Xóa interval khi component unmount
//     return () => clearInterval(countdown);
//   }, [isSubmitted]);

//   // Cập nhật câu trả lời người chơi đã chọn
//   const handleAnswerSelection = (questionIndex, answerIndex) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[questionIndex] = answerIndex;
//     setAnswers(updatedAnswers);

//     // Cập nhật tham chiếu tới câu trả lời mới nhất
//     answersRef.current = updatedAnswers;

//     // Lưu câu trả lời vào localStorage
//     const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
//     storedAnswers[questionIndex] = answerIndex;
//     localStorage.setItem(gameId, JSON.stringify(storedAnswers));
//     console.log(
//       "Updated localStorage:",
//       JSON.parse(localStorage.getItem(gameId))
//     );
//   };

//   // Submit câu trả lời
//   const handleSubmit = () => {
//     if (isSubmitted) return; // Nếu đã nộp bài, không làm gì nữa

//     // Gửi câu trả lời lên server, kèm theo username
//     socket.emit("submit-answers", {
//       gameId,
//       answers: answersRef.current, // Sử dụng câu trả lời mới nhất từ ref
//       username: usernameFromUrl, // Truyền username từ URL
//     });

//     // Xóa dữ liệu trong localStorage sau khi nộp bài
//     localStorage.removeItem(gameId);
//     setIsSubmitted(true);
//     console.log("Submitted answers:", answersRef.current);
//   };

//   if (isSubmitted) {
//     return (
//       <div>
//         <h1>Game Over</h1>
//         <p>
//           Your Score: {result?.correctAnswersCount}/{result?.totalQuestions}
//         </p>
//         <p>{result?.message}</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return <p>Loading questions...</p>;
//   }

//   return (
//     <div>
//       <h1>Game in Progress</h1>
//       <p>Time Remaining: {timeRemaining} seconds</p>
//       <ul>
//         {questions.map((question, questionIndex) => (
//           <li key={questionIndex}>
//             <p>{question.question}</p>
//             <ul>
//               {question.answers.map((answer, answerIndex) => (
//                 <li
//                   key={answerIndex}
//                   onClick={() =>
//                     handleAnswerSelection(questionIndex, answerIndex)
//                   }
//                   style={{
//                     cursor: "pointer",
//                     padding: "10px",
//                     margin: "5px 0",
//                     backgroundColor:
//                       answers[questionIndex] === answerIndex
//                         ? "#e6ffe6"
//                         : "#fff",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   {answer}
//                 </li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleSubmit}>Submit Answers</button>
//     </div>
//   );
// };

// export default GamePlay;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://quizzlet-19y7.onrender.com/"); // Kết nối tới server

const GamePlay = () => {
  const { gameId } = useParams(); // Lấy gameId từ URL
  const { search } = useLocation(); // Lấy search params từ URL
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [answers, setAnswers] = useState([]); // Mảng lưu câu trả lời của người chơi
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã nộp bài
  const [result, setResult] = useState(null); // Kết quả từ server
  const [loading, setLoading] = useState(true); // Trạng thái tải câu hỏi
  const [timeRemaining, setTimeRemaining] = useState(0); // Thời gian còn lại (giây)

  const answersRef = useRef([]); // Tham chiếu tới câu trả lời mới nhất

  // Lấy username từ URL search params
  const params = new URLSearchParams(search);
  const usernameFromUrl = params.get("username");

  useEffect(() => {
    // Yêu cầu câu hỏi từ server
    socket.emit("play-game", gameId);

    socket.on("game-questions", ({ questions, duration }) => {
      console.log("Questions received:", questions);
      setQuestions(questions);

      // Lấy câu trả lời đã lưu từ localStorage
      const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
      const initialAnswers = questions.map((_, index) =>
        storedAnswers[index] !== undefined ? storedAnswers[index] : null
      );

      setAnswers(initialAnswers); // Khôi phục câu trả lời
      answersRef.current = initialAnswers; // Đồng bộ tham chiếu

      setTimeRemaining(duration); // Đồng bộ thời gian còn lại từ server
      setLoading(false);
    });

    socket.on("game-result", (result) => {
      console.log("Result received:", result);
      setResult(result);
      setIsSubmitted(true);
    });

    // Lắng nghe sự kiện game-summary
    // socket.on("game-summary", (data) => {
    //   console.log("Player received game summary:", data);
    // });

    return () => {
      socket.off("game-questions");
      socket.off("game-result");
      // socket.off("game-summary");
    };
  }, [gameId]);

  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Gọi handleSubmit khi hết thời gian
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  useEffect(() => {
    // Lắng nghe sự kiện game-summary
    socket.on("game-summary", (data) => {
      console.log("Player received game summary:", data);
      // alert(`Game summary: ${JSON.stringify(data, null, 2)}`);
    });

    return () => {
      socket.off("game-summary"); // Gỡ bỏ sự kiện khi component unmount
    };
  }, []);

  const handleAnswerSelection = (questionIndex, answerIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answerIndex;
    setAnswers(updatedAnswers);

    answersRef.current = updatedAnswers; // Đồng bộ tham chiếu

    // Lưu câu trả lời vào localStorage
    const storedAnswers = JSON.parse(localStorage.getItem(gameId)) || {};
    storedAnswers[questionIndex] = answerIndex;
    localStorage.setItem(gameId, JSON.stringify(storedAnswers));
    console.log("Updated localStorage:", storedAnswers);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    socket.emit("submit-answers", {
      gameId,
      answers: answersRef.current, // Gửi câu trả lời mới nhất
      username: usernameFromUrl,
    });

    localStorage.removeItem(gameId); // Xóa câu trả lời trong localStorage
    setIsSubmitted(true);
    console.log("Submitted answers:", answersRef.current);
  };

  if (isSubmitted) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>
          Your Score: {result?.correctAnswersCount}/{result?.totalQuestions}
        </p>
        <p>{result?.message}</p>
      </div>
    );
  }

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div>
      <h1>Game in Progress</h1>
      <p>Time Remaining: {timeRemaining} seconds</p>
      <ul>
        {questions.map((question, questionIndex) => (
          <li key={questionIndex}>
            <p>{question.question}</p>
            <ul>
              {question.answers.map((answer, answerIndex) => (
                <li
                  key={answerIndex}
                  onClick={() =>
                    handleAnswerSelection(questionIndex, answerIndex)
                  }
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor:
                      answers[questionIndex] === answerIndex
                        ? "#e6ffe6"
                        : "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  {answer}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
};

export default GamePlay;
