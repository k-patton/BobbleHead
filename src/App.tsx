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
  const [isCalculating, setIsCalculating] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);

  const calculatePlayerScores = (universities: any): Participant[] => {
    return players.map((player) => {
      let totalScore = 0;
      player.schools.forEach((school: any) => {
        if (universities[school.id]) {
          totalScore += universities[school.id].score;
        }
      });
      return { ...player, score: totalScore };
    });
  };

  const handleFindWinner = async () => {
    setIsCalculating(true);
    try {
      const newUniversities = await calculateWinner(
        "2025",
        universities,
        players
      );
      setUniversities(newUniversities);

      // Calculate player scores
      const updatedPlayers = calculatePlayerScores(newUniversities);
      setPlayers(updatedPlayers);

      // Find the winner (highest score)
      const winningPlayer = updatedPlayers.reduce((prev, current) =>
        current.score > prev.score ? current : prev
      );
      setWinner(winningPlayer);

      console.log("Updated Universities:", newUniversities);
      console.log("Player Scores:", updatedPlayers);
      console.log("Winner:", winningPlayer);
    } catch (error) {
      console.error("Error calculating winner:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>🏈 It's Bobble Head Tournament Time! 🏈</h1>
        
        {winner && (
          <div className="winner-announcement">
            <h2>🏆 Winner: {winner.name}! 🏆</h2>
            <h3>Final Score: {winner.score} points</h3>
          </div>
        )}

        <h2>Current Players:</h2>
        <div className="players">
          {players
            .sort((a, b) => b.score - a.score)
            .map((p) => {
              return (
                <PlayerCard key={p.name} player={p} schoolList={universities} />
              );
            })}
        </div>

        <button onClick={handleFindWinner} disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Find the winner!"}
        </button>
      </div>

      <div>
        <AddPlayer 
          onAddPlayer={(newPlayer: Participant) => {
            setPlayers([...players, newPlayer]);
          }}
        />
      </div>
    </div>
  );
};

export default App;
