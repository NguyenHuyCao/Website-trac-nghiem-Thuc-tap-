import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://quizzlet-19y7.onrender.com/"); // Kết nối tới server

const PlayerPanel = () => {
  const [gameId, setGameId] = useState(""); // ID của trò chơi
  const [username, setUsername] = useState(""); // Tên người chơi
  const [message, setMessage] = useState(""); // Thông báo hiển thị
  const [players, setPlayers] = useState([]); // Danh sách người chơi trong phòng chờ
  const navigate = useNavigate();

  useEffect(() => {
    // Lắng nghe sự kiện cập nhật danh sách người chơi từ server
    socket.on("game-updated", (game) => {
      if (game.gameId === gameId) {
        setPlayers(game.players || []);
        setMessage("Waiting for admin to start the game...");
      }
    });

    // Lắng nghe sự kiện bắt đầu trò chơi
    socket.on("start-game", ({ url }) => {
      setMessage("The game is starting...");
      navigate(url); // Điều hướng đến đường dẫn được gửi từ server
    });

    return () => {
      socket.off("game-updated"); // Dọn sạch sự kiện khi component bị hủy
      socket.off("start-game");
    };
  }, [gameId, navigate]);

  const joinGame = () => {
    if (gameId.trim() && username.trim()) {
      // Gửi thông tin tham gia lên server
      socket.emit("join-game", { gameId, username });
      setMessage(`Joined game ${gameId}. Waiting for admin...`);
    } else {
      setMessage("Please enter a valid Game ID and Username!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Join Game</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={joinGame}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Join Game
        </button>
        <p style={{ marginTop: "10px", color: "red" }}>{message}</p>
      </div>
      {players.length > 0 && (
        <div>
          <h3>Players in the Room:</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
