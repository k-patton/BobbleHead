import React from "react";
import { Participant } from "../../App.schema";
import "./playerCard.css";

interface PlayerProps {
  player: Participant;
}

export const PlayerCard: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { player } = props;
  return (
    <div className="player-card">
      <div className="top">
        <img src="player.png" alt="football player" height="75" />
        <div>
          <h3 className="player-card-name">{player.name} </h3>
        </div>
      </div>
      <div className="player-card-schools">
        {player.schools.map((s) => {
          return <div> {s.name} </div>;
        })}
      </div>
    </div>
  );
};
