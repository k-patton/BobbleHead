import React, { useState } from "react";
import "./App.css";
import { Participant, University } from "./App.schema";
import { PlayerCard } from "./components/PlayerCard/playerCard";

let people = require("./data/currentPlayers.json"); 

const App:  React.FC = () => {

  const [universities, setUniversities] = useState<University[]>([]); 
  const [players, setPlayers] = useState<Participant[]>(people); 

  return (
    <div className="App">
      <img src="./football-logo-sm.png" className="football-logo" alt="logo" height="200" />
      <div>
        <h1> It's Bobble Head Tournament Time! </h1>
        <h2> Current Players: </h2>
        <div className="players"> 
        {players.map(p => {
          console.log(p); 
          return (
            <PlayerCard player={p} /> 
          )
        })}
        </div>
      </div>
     </div>
  )
};

export default App; 