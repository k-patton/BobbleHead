import { getScoreboard } from "../apis/scoreboard";
import { getGames } from "../apis/collegefootballdata";
import { Game, Participant, Result } from "../App.schema";

// Import manual games that might be missing from APIs
let manualGames: Game[] = [];
try {
    manualGames = require("../data/manualGames2025.json");
} catch (e) {
    // No manual games file
}

const USE_COLLEGE_FOOTBALL_DATA_API = true; // Toggle between ESPN and CollegeFootballData.com

const checkIfGameIsRelevant = (event: any, universities: any, games: Game[]) => {
    // Safety check: ensure event has competitions
    if (!event.competitions || !event.competitions[0] || !event.competitions[0].competitors) {
        return null;
    }

    const competitors = event.competitions[0].competitors;

    // Ensure we have exactly 2 competitors
    if (competitors.length !== 2) {
        return null;
    }

    // Check if both competitors are universities on our list
    if (universities[competitors[0].team.id] && universities[competitors[1].team.id]) {
        // Check if we haven't already added this game to our array
        if (!games.find(g => g.id === event.id)) {
            return {
                id: event.id,
                name: event.name,
                date: event.date || event.competitions[0].date || "",
                team1: {
                    id: competitors[0].team.id,
                    name: competitors[0].team.displayName,
                    score: competitors[0].score,
                    result: competitors[0].winner === true ? Result.win : competitors[0].winner === false ? Result.loss : Result.tie
                },
                team2: {
                    id: competitors[1].team.id,
                    name: competitors[1].team.displayName,
                    score: competitors[1].score,
                    result: competitors[1].winner === true ? Result.win : competitors[1].winner === false ? Result.loss : Result.tie
                }
            };
        }
    }

    return null;
};


export const calculateWinner = async (
    year: string, 
    universities: any, 
    players: Participant[],
    onGameProcessed?: (game: Game, processed: number, total: number) => Promise<void>
) => {
    console.log(`🏈 Calculating scores for ${year} season...`);

    // Create a deep copy to avoid mutating the original
    const newUniversities = JSON.parse(JSON.stringify(universities));
    
    // Reset all scores to 0
    Object.keys(newUniversities).forEach(teamId => {
        newUniversities[teamId].score = 0;
    });

    // Fetch games from multiple weeks
    const allGames: any[] = [];
    
    if (USE_COLLEGE_FOOTBALL_DATA_API) {
        // Use CollegeFootballData.com API (includes ALL games - FBS, FCS, and crossover)
        console.log("Using CollegeFootballData.com API...");
        try {
            const gamesData = await getGames(parseInt(year));
            
            // Transform the data to match our expected format
            gamesData.forEach((game: any) => {
                if (game.homeTeam && game.awayTeam && game.homePoints !== null && game.awayPoints !== null) {
                    allGames.push({
                        id: game.id.toString(),
                        date: game.startDate,
                        name: `${game.awayTeam} at ${game.homeTeam}`,
                        competitions: [{
                            date: game.startDate,
                            competitors: [
                                {
                                    team: {
                                        id: game.homeId?.toString() || game.homeTeam,
                                        displayName: game.homeTeam,
                                    },
                                    score: game.homePoints?.toString() || "0",
                                    winner: game.homePoints > game.awayPoints
                                },
                                {
                                    team: {
                                        id: game.awayId?.toString() || game.awayTeam,
                                        displayName: game.awayTeam,
                                    },
                                    score: game.awayPoints?.toString() || "0",
                                    winner: game.awayPoints > game.homePoints
                                }
                            ]
                        }]
                    });
                }
            });
            console.log(`Fetched ${allGames.length} games from CollegeFootballData.com`);
        } catch (err: any) {
            console.error("Error fetching from CollegeFootballData.com:", err.message);
            console.log("Falling back to ESPN API...");
        }
    }
    
    // Fallback to ESPN API if needed
    if (allGames.length === 0) {
        console.log("Using ESPN API...");
        for (let week = 1; week <= 17; week++) {
            try {
                const fbs = await getScoreboard(year, "80", week);
                const fcs = await getScoreboard(year, "81", week);
                
                if (fbs.events) allGames.push(...fbs.events);
                if (fcs.events) allGames.push(...fcs.events);
            } catch (err) {
                console.log(`Week ${week} - no data`);
            }
        }
    }

    const games: Game[] = [];
    const gamesByTeam: { [teamId: string]: Game[] } = {};

    console.log(`Found ${allGames.length} total games`);

    // First pass - collect all relevant games
    const relevantGames: Game[] = [];
    for (let i = 0; i < allGames.length; i++) {
        const newGame = checkIfGameIsRelevant(allGames[i], newUniversities, games);
        if (newGame) {
            relevantGames.push(newGame);
            games.push(newGame);
        }
    }

    // Add manual games
    manualGames.forEach((manualGame) => {
        if (newUniversities[manualGame.team1.id] && newUniversities[manualGame.team2.id]) {
            if (!games.find(g => g.id === manualGame.id)) {
                relevantGames.push(manualGame);
                games.push(manualGame);
            }
        }
    });

    console.log(`Found ${relevantGames.length} relevant games to process (including ${manualGames.length} manual entries)`);

    // Second pass - process games with callback for animation
    for (let i = 0; i < relevantGames.length; i++) {
        const game = relevantGames[i];
        
        // Track games by team
        if (!gamesByTeam[game.team1.id]) {
            gamesByTeam[game.team1.id] = [];
        }
        if (!gamesByTeam[game.team2.id]) {
            gamesByTeam[game.team2.id] = [];
        }
        gamesByTeam[game.team1.id].push(game);
        gamesByTeam[game.team2.id].push(game);
        
        // Update scores based on game results
        if (game.team1.result === Result.win) {
            newUniversities[game.team1.id].score += 1;
        }
        if (game.team2.result === Result.win) {
            newUniversities[game.team2.id].score += 1;
        }
        if (game.team1.result === Result.loss) {
            newUniversities[game.team1.id].score -= 1;
        }
        if (game.team2.result === Result.loss) {
            newUniversities[game.team2.id].score -= 1;
        }

        // Call callback for visual update
        if (onGameProcessed) {
            await onGameProcessed(game, i + 1, relevantGames.length);
            // Add delay between games for better readability
            await new Promise(resolve => setTimeout(resolve, 2500));
        }
    }

    console.log(`Processed ${games.length} relevant games`);
    console.log("Team Scores:", newUniversities);

    // Calculate and log player scores
    for (let i = 0; i < players.length; i++) {
        let score = 0;
        let player = players[i];
        for (let j = 0; j < player.schools.length; j++) {
            let id = player.schools[j].id;
            if (newUniversities[id]) {
                score += newUniversities[id].score;
            }
        }
        console.log(`${player.name}'s score: ${score}`);
    }

    return { universities: newUniversities, gamesByTeam };
};