import React from "react";
import "./LoadingScreen.css";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-icon">🏈</div>
        <h2 className="loading-title">Crunching the Numbers</h2>
        <div className="loading-subtitle">Fetching game data...</div>
        <div className="loading-spinner">
          <div className="spinner-bounce"></div>
          <div className="spinner-bounce"></div>
          <div className="spinner-bounce"></div>
        </div>
      </div>
    </div>
  );
};

