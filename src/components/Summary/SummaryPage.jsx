import React from "react";
import { useLocation } from "react-router-dom";

const SummaryPage = () => {
  const location = useLocation();
  const summary = location.state?.summary; // Nhận dữ liệu summary từ state

  if (!summary) {
    return <p>No summary available</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Game Summary</h1>
      <h2>Game ID: {summary.gameId}</h2>
      <h3>Status: {summary.status}</h3>
      <h4>Admin: {summary.admin}</h4>
      <h4>Players:</h4>
      <ul>
        {summary.players.map((player, index) => (
          <li key={index}>
            {player.username}: {player.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryPage;
