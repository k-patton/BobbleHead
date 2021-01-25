import React, { useState } from "react";
import "./App.css";
import { Participant, School } from "./App.schema";
import { AddPlayer } from "./components/AddPlayer/addPlayer";
import { PlayerCard } from "./components/PlayerCard/playerCard";
import { calculateWinner } from "./services/calculateWinner";

let people = require("./data/currentPlayers.json");
let schools = require("./data/teams.json");

const App: React.FC = () => {
  const [universities, setUniversities] = useState<any>(schools);
  const [players, setPlayers] = useState<Participant[]>(people);

  const handleFindWinner = async () => {
    const newUniversities = await calculateWinner(
      "2020",
      universities,
      players
    );
    setUniversities(newUniversities);
    console.log(newUniversities);
    // let winner;
    // for (let i = 0; i < players.length; i++) {
    //   let score = 0;
    //   let player = players[i];
    //   for (let j = 0; j < player.schools.length; j++) {
    //     let id = player.schools[j].id;
    //     console.log(id, "score");
    //     if (newUniversities) {
    //       console.log(newUniversities[id].score);
    //     } else {
    //       console.log("not defined");
    //       console.log(newUniversities);
    //     }
    //     // score += newUniversities[players[i].schools[j].id].score;
    //   }

    //   // console.log(score);
    // }
    // // console.log("new", universities);
  };

  return (
    <div className="App">
      <div>
        <h1> It's Bobble Head Tournament Time! </h1>
        <h2> Current Players: </h2>
        <div className="players">
          {players.map((p) => {
            return (
              <PlayerCard key={p.name} player={p} schoolList={universities} />
            );
          })}
        </div>

        <button onClick={handleFindWinner}>Find the winner!</button>
      </div>

      <div>
        <AddPlayer />
      </div>
    </div>
  );
};

export default App;
