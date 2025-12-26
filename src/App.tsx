import React, { useState } from "react";
import "./App.css";
import { Participant, Game } from "./App.schema";
import { AddPlayer } from "./components/AddPlayer/addPlayer";
import { PlayerCard } from "./components/PlayerCard/playerCard";
import { GameProcessingModal } from "./components/GameProcessingModal/GameProcessingModal";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { GamesAccordion } from "./components/GamesAccordion/GamesAccordion";
import { calculateWinner } from "./services/calculateWinner";

let people = require("./data/currentPlayers.json");
let schools = require("./data/teams.json");

const App: React.FC = () => {
  const [universities, setUniversities] = useState<any>(schools);
  const [players, setPlayers] = useState<Participant[]>(people);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [gamesByTeam, setGamesByTeam] = useState<{ [teamId: string]: Game[] }>({});
  const [allRelevantGames, setAllRelevantGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gamesProcessed, setGamesProcessed] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

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
    setIsLoading(true);
    setWinner(null);
    setWinners([]);
    
    try {
      // Callback to handle each game processed
      const onGameProcessed = async (game: Game, processed: number, total: number) => {
        // Hide loading screen once we start processing games
        if (processed === 1) {
          setIsLoading(false);
        }
        
        setCurrentGame(game);
        setGamesProcessed(processed);
        setTotalGames(total);
        
        // Add dramatic pause - increased from 800ms to 1500ms
        await new Promise(resolve => setTimeout(resolve, 1500));
      };

      const result = await calculateWinner(
        "2025",
        universities,
        players,
        onGameProcessed
      );
      
      // Clear the processing modal
      setCurrentGame(null);
      
      setUniversities(result.universities);
      setGamesByTeam(result.gamesByTeam);
      
      // Extract all games for the accordion
      const allGames: Game[] = [];
      Object.values(result.gamesByTeam).forEach((games: any) => {
        games.forEach((game: Game) => {
          if (!allGames.find(g => g.id === game.id)) {
            allGames.push(game);
          }
        });
      });
      setAllRelevantGames(allGames);

      // Calculate player scores
      const updatedPlayers = calculatePlayerScores(result.universities);
      setPlayers(updatedPlayers);

      // Find the highest score
      const highestScore = Math.max(...updatedPlayers.map(p => p.score));
      
      // Find all players with the highest score
      const topPlayers = updatedPlayers.filter(p => p.score === highestScore);
      
      if (topPlayers.length === 1) {
        // Single winner
        setWinner(topPlayers[0]);
        setWinners([]);
      } else {
        // Tie - multiple winners
        setWinner(null);
        setWinners(topPlayers);
      }

      console.log("Updated Universities:", result.universities);
      console.log("Player Scores:", updatedPlayers);
      console.log(topPlayers.length > 1 ? "Tie between:" : "Winner:", topPlayers);
    } catch (error) {
      console.error("Error calculating winner:", error);
      setCurrentGame(null);
      setIsLoading(false);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      
      {currentGame && !isLoading && (
        <GameProcessingModal
          game={currentGame}
          gamesProcessed={gamesProcessed}
          totalGames={totalGames}
        />
      )}
      
      <div className="App">
        <header className="app-header-fixed">
          <h1>🏈 It's Bobble Head Tournament Time! 🏈</h1>
        </header>

        <div className="app-content">
          {winner && (
            <div className="winner-announcement">
              <h2>Winner: {winner.name}!</h2>
              <h3>Final Score: {winner.score} points</h3>
            </div>
          )}

          {winners.length > 0 && (
            <div className="winner-announcement tie">
              <h2>It's a Tie!</h2>
              <h3>
                {winners.map((w, i) => (
                  <span key={w.name}>
                    {i > 0 && (i === winners.length - 1 ? " and " : ", ")}
                    {w.name}
                  </span>
                ))}{" "}
                have {winners[0].score} points
              </h3>
            </div>
          )}

          <h2>Current Players:</h2>
          <div className="players">
            {players
              .sort((a, b) => b.score - a.score)
              .map((p) => {
                return (
                  <PlayerCard 
                    key={p.name} 
                    player={p} 
                    schoolList={universities}
                    gamesByTeam={gamesByTeam}
                  />
                );
              })}
          </div>

          <GamesAccordion games={allRelevantGames} universities={universities} />

          <div>
            <AddPlayer 
              onAddPlayer={(newPlayer: Participant) => {
                setPlayers([...players, newPlayer]);
              }}
            />
          </div>
        </div>

        <footer className="app-footer-fixed">
          <button onClick={handleFindWinner} disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Find the winner!"}
          </button>
        </footer>
      </div>
    </>
  );
};

export default App;
