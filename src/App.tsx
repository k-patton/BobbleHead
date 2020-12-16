import React, { useState } from "react";
import "./App.css";
import { Participant, University } from "./App.schema";
import { PlayerCard } from "./components/PlayerCard/playerCard";
import { calculateWinner } from "./services/calculateWinner";

let people = require("./data/currentPlayers.json");
let schools = require("./data/currentTeams.json");

const App: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>(schools);
  const [players, setPlayers] = useState<Participant[]>(people);

  return (
    <div className="App">
      <img
        src="./football-logo-sm.png"
        className="football-logo"
        alt="logo"
        height="200"
      />
      <div>
        <h1> It's Bobble Head Tournament Time! </h1>
        <h2> Current Players: </h2>
        <div className="players">
          {players.map((p) => {
            return <PlayerCard key={p.name} player={p} />;
          })}
        </div>

        <button
          onClick={() => {
            calculateWinner("2020", universities);
          }}
        >
          Find the winner!
        </button>
      </div>
    </div>
  );
};

export default App;
