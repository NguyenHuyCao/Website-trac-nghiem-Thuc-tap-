import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";

const socket = io("https://quizzlet-19y7.onrender.com/"); // Kết nối tới server

const AdminGamePage = () => {
  const { gameId } = useParams(); // Lấy gameId từ URL
  const { state } = useLocation(); // Lấy duration từ state của navigate
  const [players, setPlayers] = useState([]); // Danh sách người chơi
  const [gameStatus, setGameStatus] = useState("waiting"); // Trạng thái trò chơi
  const [duration, setDuration] = useState(state ? state.duration : 0); // Duration từ state

  useEffect(() => {
    // Lắng nghe sự kiện "game-updated" từ server
    socket.on("game-updated", (game) => {
      console.log("Thông tin game bên CLIENT:", game); // Log kiểm tra
      if (game.gameId === gameId) {
        setPlayers(game.players); // Cập nhật danh sách người chơi
        setGameStatus(game.status); // Cập nhật trạng thái trò chơi
      }
    });

    // Gửi yêu cầu lấy trạng thái game hiện tại
    socket.emit("get-game-status", gameId);

    // Cleanup sự kiện khi component unmount
    return () => {
      socket.off("game-updated");
    };
  }, [gameId]);

  const idgame = "674f1a277b71a0cbd8e35bf8";
  const createGame = () => {
    // Gửi sự kiện tạo game đến server
    socket.emit("create-game", { gameId, duration, idgame });
  };

  const startGame = () => {
    // Admin bắt đầu trò chơi
    socket.emit("start-game", gameId);
    setGameStatus("playing");
  };

  useEffect(() => {
    // Tạo game khi vào trang AdminGamePage
    createGame();
  }, []); // Chỉ chạy một lần khi trang được load

  return (
    <div>
      <h1>Admin Game Page</h1>
      <h2>Game ID: {gameId}</h2>
      <h3>Status: {gameStatus}</h3>

      <h4>Players in the game:</h4>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>

      {gameStatus === "waiting" && (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default AdminGamePage;
