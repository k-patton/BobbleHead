import React, { useState, useEffect } from "react";
import { Game } from "../../App.schema";
import "./GameProcessingModal.css";

interface GameProcessingModalProps {
  game: Game | null;
  gamesProcessed: number;
  totalGames: number;
}

export const GameProcessingModal: React.FC<GameProcessingModalProps> = ({
  game,
  gamesProcessed,
  totalGames,
}) => {
  const [showWinnerHighlight, setShowWinnerHighlight] = useState(false);
  const [showWinnerText, setShowWinnerText] = useState(false);

  useEffect(() => {
    // Reset states when game changes
    setShowWinnerHighlight(false);
    setShowWinnerText(false);

    // Show winner highlight after 1000ms
    const highlightTimer = setTimeout(() => {
      setShowWinnerHighlight(true);
    }, 1000);

    // Show winner text after 1800ms
    const textTimer = setTimeout(() => {
      setShowWinnerText(true);
    }, 1800);

    return () => {
      clearTimeout(highlightTimer);
      clearTimeout(textTimer);
    };
  }, [game]);

  if (!game) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWinner = () => {
    if (game.team1.result === "WIN") {
      return { name: game.team1.name, score: game.team1.score };
    }
    if (game.team2.result === "WIN") {
      return { name: game.team2.name, score: game.team2.score };
    }
    return null;
  };

  const winner = getWinner();

  return (
    <div className="processing-overlay">
      <div className="processing-content">
        <div className="processing-header">
          <div className="processing-progress">
            Game {gamesProcessed} of {totalGames}
          </div>
        </div>

        <div className="processing-body">
          <div className="game-date-display">{formatDate(game.date)}</div>
          
          <div className="matchup-display">
            <div className={`team ${game.team1.result === "WIN" && showWinnerHighlight ? "winner" : ""}`}>
              <div className="team-name">{game.team1.name}</div>
              <div className="team-score">{game.team1.score}</div>
            </div>
            
            <div className="vs-divider">vs</div>
            
            <div className={`team ${game.team2.result === "WIN" && showWinnerHighlight ? "winner" : ""}`}>
              <div className="team-name">{game.team2.name}</div>
              <div className="team-score">{game.team2.score}</div>
            </div>
          </div>

          {showWinnerText && (
            <>
              {winner ? (
                <div className="result-display">
                  🏆 {winner.name} wins!
                </div>
              ) : (
                <div className="result-display tie-result">
                  It's a tie!
                </div>
              )}
            </>
          )}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(gamesProcessed / totalGames) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

