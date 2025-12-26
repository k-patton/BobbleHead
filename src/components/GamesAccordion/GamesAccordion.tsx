import React, { useState } from "react";
import { Game } from "../../App.schema";
import "./GamesAccordion.css";

interface GamesAccordionProps {
  games: Game[];
  universities: any;
}

export const GamesAccordion: React.FC<GamesAccordionProps> = ({
  games,
  universities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("all");

  if (games.length === 0) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Sort games by date
  const sortedGames = [...games].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Filter games by selected team
  const filteredGames =
    selectedTeamFilter === "all"
      ? sortedGames
      : sortedGames.filter(
          (game) =>
            game.team1.id === selectedTeamFilter ||
            game.team2.id === selectedTeamFilter
        );

  // Get list of teams involved
  const teamsInvolved = Object.keys(universities).sort((a, b) =>
    universities[a].displayName.localeCompare(universities[b].displayName)
  );

  return (
    <div className="games-accordion">
      <button
        className="accordion-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="accordion-title">
          📋 All Relevant Games ({games.length})
        </span>
        <span className={`accordion-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="accordion-content">
          <div className="games-filters">
            <label>Filter by team:</label>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="team-filter-select"
            >
              <option value="all">All Teams ({games.length} games)</option>
              {teamsInvolved.map((teamId) => {
                const teamGames = games.filter(
                  (g) => g.team1.id === teamId || g.team2.id === teamId
                );
                return (
                  <option key={teamId} value={teamId}>
                    {universities[teamId].displayName} ({teamGames.length}{" "}
                    games)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="games-list">
            {filteredGames.map((game) => {
              const winner =
                game.team1.result === "WIN"
                  ? game.team1.name
                  : game.team2.result === "WIN"
                  ? game.team2.name
                  : null;

              return (
                <div
                  key={game.id}
                  className={`game-card ${
                    selectedTeamFilter !== "all" ? "highlighted" : ""
                  }`}
                >
                  <div className="game-date">{formatDate(game.date)}</div>
                  <div className="game-matchup-container">
                    <div
                      className={`game-team ${
                        game.team1.result === "WIN" ? "winner" : ""
                      }`}
                    >
                      <div className="team-info">
                        <span className="team-name-text">
                          {game.team1.name}
                        </span>
                        {game.team1.result === "WIN" && (
                          <span className="winner-badge">W</span>
                        )}
                      </div>
                      <div className="team-score-text">{game.team1.score}</div>
                    </div>

                    <div className="vs-separator">vs</div>

                    <div
                      className={`game-team ${
                        game.team2.result === "WIN" ? "winner" : ""
                      }`}
                    >
                      <div className="team-info">
                        <span className="team-name-text">
                          {game.team2.name}
                        </span>
                        {game.team2.result === "WIN" && (
                          <span className="winner-badge">W</span>
                        )}
                      </div>
                      <div className="team-score-text">{game.team2.score}</div>
                    </div>
                  </div>
                  {winner && (
                    <div className="game-winner-label">
                      🏆 {winner} wins
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredGames.length === 0 && (
            <div className="no-games-message">
              No games found for selected team.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

