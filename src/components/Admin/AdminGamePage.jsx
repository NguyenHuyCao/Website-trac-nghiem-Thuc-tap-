import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";
import { QRCode } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./AdminGamePage.scss";

const socket = io("https://quizzlet-19y7.onrender.com/"); // Kết nối tới server

const AdminGamePage = () => {
  const { gameId } = useParams(); // Lấy gameId từ URL
  const { state } = useLocation(); // Lấy duration từ state của navigate
  const [players, setPlayers] = useState([]); // Danh sách người chơi
  const [gameStatus, setGameStatus] = useState("waiting"); // Trạng thái trò chơi
  const [summary, setSummary] = useState(null); // Dữ liệu tổng kết
  const [isShowResult, setIsShowResult] = useState(false);
  const [pauseCooldown, setPauseCooldown] = useState(10); // Thời gian chờ để nút "Tạm dừng" khả dụng
  const [isPauseEnabled, setIsPauseEnabled] = useState(false); // Trạng thái khả dụng của nút "Tạm dừng"

  console.log("state", state);

  useEffect(() => {
    // Lắng nghe sự kiện "game-updated" từ server
    socket.on("game-updated", (game) => {
      if (game.gameId === gameId) {
        setPlayers(game.players); // Cập nhật danh sách người chơi
        setGameStatus(game.status); // Cập nhật trạng thái trò chơi
      }
    });

    // Lắng nghe sự kiện "game-summary" từ server
    socket.on("game-summary", (data) => {
      setSummary(data); // Lưu dữ liệu tổng kết
    });

    // Gửi yêu cầu lấy trạng thái game hiện tại
    socket.emit("get-game-status", gameId);
    setPauseCooldown(state.quiz.duration);

    // Cleanup sự kiện khi component unmount
    return () => {
      socket.off("game-updated");
      socket.off("game-summary");
    };
  }, [gameId]);

  useEffect(() => {
    // Giảm dần bộ đếm thời gian chờ
    if (pauseCooldown > 0) {
      const timer = setInterval(() => {
        setPauseCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsPauseEnabled(true); // Kích hoạt nút "Tạm dừng" khi hết thời gian chờ
    }
  }, [pauseCooldown]);

  const idgame = state.quizId; // ID trò chơi cố định

  const createGame = () => {
    // Gửi sự kiện tạo game đến server
    socket.emit("create-game", { gameId, idgame });
  };

  const startGame = () => {
    // Admin bắt đầu trò chơi
    socket.emit("start-game", gameId);
    setGameStatus("playing");
  };

  const fetchSummary = () => {
    // Gửi dữ liệu tổng kết
    socket.emit("send-game-summary", gameId);
    setIsShowResult(true);
  };

  useEffect(() => {
    createGame();
  }, []);

  const chartData =
    summary && Array.isArray(summary.players)
      ? {
          labels: summary.players.map((p) => p.username),
          datasets: [
            {
              label: "Điểm số",
              data: summary.players.map((p) => p.score * 100),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }
      : null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Tính số giờ
    const minutes = Math.floor((seconds % 3600) / 60); // Tính số phút còn lại
    const secs = seconds % 60; // Tính số giây còn lại

    // Định dạng kết quả với 2 chữ số cho mỗi đơn vị thời gian
    const resultTime = `${hours.toString().padStart(2, "0")} : ${minutes
      .toString()
      .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
    return resultTime;
  };

  return (
    <div className="admin-game-page">
      <h1 className="quiz-title">Bài thi: {state.quiz.title}</h1>
      <p className="quiz-description">Mô tả: {state.quiz.description}</p>{" "}
      <h2 className="game-id">ID bài thi: {gameId}</h2>
      <div className="qr-code-container">
        <span className="qr-label">Mã QR: </span>
        <QRCode value={gameId} className="qr-code" />
      </div>
      <h4 className="players-header">Người tham gia:</h4>{" "}
      <ul className="players-list">
        {players.map((player) => (
          <li key={player.id} className="player-item">
            {player.username}
          </li>
        ))}
      </ul>
      {gameStatus === "waiting" && (
        <button className="start-game-button" onClick={startGame}>
          Bắt đầu làm bài
        </button>
      )}
      {gameStatus === "playing" && !isShowResult && (
        <>
          <button
            className="fetch-summary-button"
            onClick={fetchSummary}
            disabled={!isPauseEnabled}
            style={{
              backgroundColor: isPauseEnabled ? "#28a745" : "#ccc",
              cursor: isPauseEnabled ? "pointer" : "not-allowed",
            }}
          >
            {isPauseEnabled
              ? "Kết quả trò chơi"
              : `Công bố kết quả sau ${formatTime(pauseCooldown)}s`}
          </button>
          {!isShowResult && (
            <button
              className="fetch-summary-button"
              onClick={fetchSummary}
              style={{
                backgroundColor: "#ff9800",
                cursor: "pointer",
              }}
            >
              Dừng trò chơi
            </button>
          )}
        </>
      )}
      {summary && Array.isArray(summary.players) && (
        <div className="final-player">
          <h2 className="number-player">
            Số lượng người tham gia: {summary.playersCount}{" "}
          </h2>
          <div className="result-table-container">
            <h3>Bảng kết quả</h3>
            <table className="result-table">
              <thead>
                <tr className="header-table">
                  <th>Tên</th>
                  <th>Điểm số</th>
                </tr>
              </thead>
              <tbody>
                {summary.players.map((p, index) => (
                  <tr key={index} className="result-row">
                    <td className="result-name">{p.username}</td>
                    <td className="result-score">
                      {(p.score * 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="chart-container">
            <h3>Biểu đồ điểm số</h3>
            {chartData && <Bar data={chartData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGamePage;
