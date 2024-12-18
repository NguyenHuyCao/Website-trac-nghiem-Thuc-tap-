// import { Input, message, Spin, Upload } from "antd";
// import { useEffect, useState } from "react";
// import { getQuizzes } from "../../services/apiServices";
// import { useNavigate } from "react-router-dom";
// import { Html5Qrcode } from "html5-qrcode";
// import { InboxOutlined } from "@ant-design/icons";
// import "./Home.scss";

// const { Search } = Input;
// const { Dragger } = Upload;

// const Home = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [quizzes, setQuizzes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       const data = await getQuizzes();
//       setQuizzes(data.quizzes);
//     };
//     fetchQuizzes();
//   }, []);

//   const handleSearch = (value) => {
//     if (!value) {
//       message.warning("Vui lòng nhập ID bài Quiz!");
//       return;
//     }

//     if (!quizzes || quizzes.length < 1) {
//       message.warning("Không tồn tại bài Quiz nào!");
//       return;
//     }

//     setIsLoading(true);

//     let currentQuiz = quizzes.filter((q) => q._id === value);

//     if (!currentQuiz || currentQuiz.length !== 1) {
//       setIsLoading(false);
//       message.error(`Không tồn tại bài Quiz có ID là: ${value}`);
//       return;
//     }

//     currentQuiz = currentQuiz[0];

//     setTimeout(() => {
//       setIsLoading(false);
//       message.success(`Tìm kiếm thành công với ID: ${value}`);
//       navigate(`/home-exam/${value}`, {
//         state: currentQuiz,
//       });
//     }, 3000);
//   };

//   const handleQRCodeScan = async (file) => {
//     // Kiểm tra định dạng file
//     const supportedFormats = ["image/png", "image/jpeg", "image/webp"];
//     if (!supportedFormats.includes(file.type)) {
//       message.error("Chỉ hỗ trợ các định dạng ảnh PNG, JPEG, hoặc WEBP.");
//       return;
//     }

//     // Tạo container cho Html5Qrcode nếu chưa tồn tại
//     const qrContainerId = "qr-reader-temp";
//     let qrContainer = document.getElementById(qrContainerId);
//     if (!qrContainer) {
//       qrContainer = document.createElement("div");
//       qrContainer.id = qrContainerId;
//       qrContainer.style.display = "none"; // Ẩn container để tránh hiển thị không cần thiết
//       document.body.appendChild(qrContainer);
//     }

//     const html5QrCode = new Html5Qrcode(qrContainerId);

//     try {
//       // Quét file trực tiếp
//       const result = await html5QrCode.scanFile(file, true);
//       const data = result.split("/");
//       // message.success(`Mã QR đã được quét: ${data[data.length - 1]}`);
//       handleSearch(data[data.length - 1]); // Tự động tìm kiếm với ID từ mã QR
//     } catch (err) {
//       message.error("Không thể đọc mã QR từ ảnh đã tải lên.");
//     } finally {
//       html5QrCode.clear(); // Dọn dẹp tài nguyên
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1 className="title">Tìm kiếm bài Quiz</h1>

//       <div className="search-wrapper">
//         <Search
//           className="search-input"
//           placeholder="Nhập ID bài Quiz"
//           enterButton="Tìm"
//           size="large"
//           loading={isLoading}
//           onSearch={handleSearch}
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//         />
//       </div>

//       {isLoading && (
//         <div className="spin-wrapper">
//           <Spin size="large" />
//         </div>
//       )}

//       <div className="upload-wrapper">
//         <Dragger
//           name="file"
//           multiple={false}
//           accept="image/*"
//           customRequest={({ file, onSuccess }) => {
//             handleQRCodeScan(file);
//             onSuccess("ok"); // Đánh dấu tải lên thành công
//           }}
//           showUploadList={false}
//         >
//           <p className="ant-upload-drag-icon upload-icon">
//             <InboxOutlined />
//           </p>
//           <p className="ant-upload-text upload-text">
//             Kéo và thả ảnh chứa mã QR bài thi vào đây hoặc bấm để chuyển tới bài
//             thi
//           </p>
//           {/* <p className="ant-upload-hint upload-hint">
//             Hỗ trợ định dạng ảnh PNG, JPEG, hoặc WEBP. Ảnh cần chứa mã QR hợp
//             lệ.
//           </p> */}
//         </Dragger>
//       </div>
//     </div>
//   );
// };

// export default Home;
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Input, Button, message, Upload } from "antd";
import { Html5Qrcode } from "html5-qrcode";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const { Dragger } = Upload;

const socket = io("https://quizzlet-19y7.onrender.com/");

const PlayerPanel = () => {
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("game-updated", (game) => {
      if (game.gameId === gameId) {
        setPlayers(game.players || []);
        setFeedback("Đang chờ quản trị viên bắt đầu trò chơi...");
      }
    });

    socket.on("start-game", ({ url }) => {
      setFeedback("The game is starting...");
      navigate(`${url}?username=${encodeURIComponent(username)}`);
    });

    return () => {
      socket.off("game-updated");
      socket.off("start-game");
    };
  }, [gameId, username, navigate]);

  const joinGame = () => {
    if (!gameId || !username) {
      message.warning("Please enter both Game ID and Username!");
      return;
    }
    socket.emit("join-game", { gameId, username });
    setFeedback(`Joined game ${gameId}. Waiting for admin...`);
  };

  const handleQRCodeScan = async (file) => {
    const qrContainerId = "qr-reader-temp";
    let qrContainer = document.getElementById(qrContainerId);
    if (!qrContainer) {
      qrContainer = document.createElement("div");
      qrContainer.id = qrContainerId;
      qrContainer.style.display = "none";
      document.body.appendChild(qrContainer);
    }

    const html5QrCode = new Html5Qrcode(qrContainerId);

    try {
      const result = await html5QrCode.scanFile(file, true);
      const idFromQR = result.split("/").pop(); // Assume Game ID is at the end
      setGameId(idFromQR);
      message.success(`Game ID extracted from QR Code: ${idFromQR}`);
    } catch (err) {
      message.error("Failed to scan QR Code.");
    } finally {
      html5QrCode.clear();
    }
  };

  return (
    <div className="player-panel-container">
      <h1 className="title">Tham gia vào bài thi</h1>

      <Input
        className="input-field"
        placeholder="Enter Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <Input
        className="input-field"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button className="join-button" type="primary" block onClick={joinGame}>
        Tham gia
      </Button>
      <p className="feedback-text">{feedback}</p>

      <div className="qr-upload-container">
        <Dragger
          name="file"
          multiple={false}
          accept="image/*"
          customRequest={({ file, onSuccess }) => {
            handleQRCodeScan(file);
            onSuccess("ok");
          }}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Kéo và thả hình ảnh Mã QR vào đây hoặc nhấp để tải lên.</p>
        </Dragger>
      </div>

      {players.length > 0 && (
        <div className="players-list">
          <h3>Người tham gia:</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index} className="player-item">
                {player.username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
