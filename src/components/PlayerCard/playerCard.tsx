import React, { useState } from "react";
import { Participant, Game } from "../../App.schema";
import { GameDetailsModal } from "../GameDetailsModal/GameDetailsModal";
import "./playerCard.css";

interface PlayerProps {
  player: Participant;
  schoolList: any;
  gamesByTeam: { [teamId: string]: Game[] };
}

export const PlayerCard: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { player, schoolList, gamesByTeam } = props;
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string } | null>(null);

  const handleSchoolClick = (teamId: string, teamName: string) => {
    if (gamesByTeam[teamId] && gamesByTeam[teamId].length > 0) {
      setSelectedTeam({ id: teamId, name: teamName });
    }
  };

  // Check if scores have been calculated (gamesByTeam has data)
  const scoresCalculated = Object.keys(gamesByTeam).length > 0;

  return (
    <>
      <div className="player-card">
        <div className="top">
          <img src="player.png" alt="football player" height="75" />
          <div>
            <h3 className="player-card-name">{player.name}</h3>
            {scoresCalculated && (
              <div className="player-total-score">
                Total: <strong>{player.score}</strong> pts
              </div>
            )}
          </div>
        </div>
        <div className="player-card-schools">
          {player.schools.map((s) => {
            if (schoolList && schoolList[s.id]) {
              const hasGames = gamesByTeam[s.id] && gamesByTeam[s.id].length > 0;
              return (
                <div
                  key={s.name}
                  className={`school-item ${hasGames ? "clickable" : ""}`}
                  onClick={() => hasGames && handleSchoolClick(s.id, schoolList[s.id].displayName)}
                  title={hasGames ? "Click to view game details" : ""}
                >
                  <div className="school-name">
                    {schoolList[s.id]?.displayName || "not found"}
                  </div>
                  <div className="school-score">
                    {schoolList[s.id]?.score > 0 && `+${schoolList[s.id]?.score}`}
                    {schoolList[s.id]?.score < 0 && schoolList[s.id]?.score}
                    {schoolList[s.id]?.score === 0 && "0"}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {selectedTeam && (
        <GameDetailsModal
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          games={gamesByTeam[selectedTeam.id] || []}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </>
  );
};
