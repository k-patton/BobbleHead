import React, { useState } from "react";
import { Participant, TeamGameInfo } from "../../App.schema";
import "./playerCard.css";

interface PlayerProps {
  player: Participant;
  schoolList: any;
}

export const PlayerCard: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { player, schoolList } = props;

  // const [score, setScore] = useState(0);

  // let score;

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
          // console.log(s.id, schoolList[s.id] || "");
          if (schoolList && schoolList[s.id]) {
            return (
              <div key={s.name}>
                {schoolList[s.id]?.displayName || "not found"}
                <div> Score: {schoolList[s.id]?.score || "na"} </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
