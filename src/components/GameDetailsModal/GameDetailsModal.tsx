import React from "react";
import { Game } from "../../App.schema";
import "./GameDetailsModal.css";

interface GameDetailsModalProps {
  teamId: string;
  teamName: string;
  games: Game[];
  onClose: () => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  teamId,
  teamName,
  games,
  onClose,
}) => {
  const wins = games.filter(
    (g) =>
      (g.team1.id === teamId && g.team1.result === "WIN") ||
      (g.team2.id === teamId && g.team2.result === "WIN")
  );

  const losses = games.filter(
    (g) =>
      (g.team1.id === teamId && g.team1.result === "LOSS") ||
      (g.team2.id === teamId && g.team2.result === "LOSS")
  );

  const ties = games.filter(
    (g) =>
      (g.team1.id === teamId && g.team1.result === "TIE") ||
      (g.team2.id === teamId && g.team2.result === "TIE")
  );

  const getOpponent = (game: Game) => {
    if (game.team1.id === teamId) {
      return { name: game.team2.name, score: game.team2.score };
    }
    return { name: game.team1.name, score: game.team1.score };
  };

  const getTeamScore = (game: Game) => {
    if (game.team1.id === teamId) {
      return game.team1.score;
    }
    return game.team2.score;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{teamName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="game-summary">
            <div className="summary-stat">
              <span className="stat-label">Record:</span>
              <span className="stat-value">
                {wins.length}-{losses.length}
                {ties.length > 0 && `-${ties.length}`}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Points:</span>
              <span className="stat-value">{wins.length - losses.length}</span>
            </div>
          </div>

          {wins.length > 0 && (
            <div className="games-section">
              <h3 className="section-title wins-title">
                Wins ({wins.length})
              </h3>
              {wins.map((game) => {
                const opponent = getOpponent(game);
                const teamScore = getTeamScore(game);
                return (
                  <div key={game.id} className="game-item win">
                    <div className="game-result">W</div>
                    <div className="game-details">
                      <div className="game-matchup">
                        vs {opponent.name}
                      </div>
                      <div className="game-score">
                        {teamScore} - {opponent.score}
                      </div>
                      {game.date && (
                        <div className="game-date">{formatDate(game.date)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {losses.length > 0 && (
            <div className="games-section">
              <h3 className="section-title losses-title">
                Losses ({losses.length})
              </h3>
              {losses.map((game) => {
                const opponent = getOpponent(game);
                const teamScore = getTeamScore(game);
                return (
                  <div key={game.id} className="game-item loss">
                    <div className="game-result">L</div>
                    <div className="game-details">
                      <div className="game-matchup">
                        vs {opponent.name}
                      </div>
                      <div className="game-score">
                        {teamScore} - {opponent.score}
                      </div>
                      {game.date && (
                        <div className="game-date">{formatDate(game.date)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {ties.length > 0 && (
            <div className="games-section">
              <h3 className="section-title ties-title">Ties ({ties.length})</h3>
              {ties.map((game) => {
                const opponent = getOpponent(game);
                const teamScore = getTeamScore(game);
                return (
                  <div key={game.id} className="game-item tie">
                    <div className="game-result">T</div>
                    <div className="game-details">
                      <div className="game-matchup">
                        vs {opponent.name}
                      </div>
                      <div className="game-score">
                        {teamScore} - {opponent.score}
                      </div>
                      {game.date && (
                        <div className="game-date">{formatDate(game.date)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {games.length === 0 && (
            <div className="no-games">
              No games found for this team in the selected timeframe.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

