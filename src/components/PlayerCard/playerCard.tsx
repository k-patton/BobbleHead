import React, { useState } from "react";
import { Participant, TeamGameInfo } from "../../App.schema";
import "./playerCard.css";

interface PlayerProps {
  player: Participant;
  schoolList: any;
}

export const PlayerCard: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { player, schoolList } = props;

  return (
    <div className="player-card">
      <div className="top">
        <img src="player.png" alt="football player" height="75" />
        <div>
          <h3 className="player-card-name">{player.name}</h3>
          {player.score > 0 && (
            <div className="player-total-score">
              Total: <strong>{player.score}</strong> pts
            </div>
          )}
        </div>
      </div>
      <div className="player-card-schools">
        {player.schools.map((s) => {
          if (schoolList && schoolList[s.id]) {
            return (
              <div key={s.name} className="school-item">
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
  );
};
