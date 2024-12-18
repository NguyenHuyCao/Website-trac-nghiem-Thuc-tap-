import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [gameId, setGameId] = useState("");
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Chỉ điều hướng đến trang AdminGamePage với gameId
    navigate(`/admin/game/${gameId}, { state: { duration } }`);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <input
        type="text"
        placeholder="Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={handleNavigate}>Go to Game Management</button>
    </div>
  );
};

export default AdminPanel;
