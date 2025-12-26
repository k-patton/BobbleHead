import { getScoreboard } from "../apis/scoreboard";
import { Game, Participant, Result } from "../App.schema";

const checkIfGameIsRelevant = (event: any, universities: any, games: Game[]) => {
    const competitors = event.competitions[0].competitors;

    // Check if both competitors are universities on our list
    if (universities[competitors[0].team.id] && universities[competitors[1].team.id]) {
        // Check if we haven't already added this game to our array
        if (!games.find(g => g.id === event.id)) {
            return {
                id: event.id,
                name: event.name,
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
};


export const calculateWinner = async (year: string, universities: any, players: Participant[]) => {
    console.log(`🏈 Calculating scores for ${year} season...`);

    // Create a deep copy to avoid mutating the original
    const newUniversities = JSON.parse(JSON.stringify(universities));
    
    // Reset all scores to 0
    Object.keys(newUniversities).forEach(teamId => {
        newUniversities[teamId].score = 0;
    });

    // Fetch games from multiple weeks
    const allGames: any[] = [];
    
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

    const games: Game[] = [];

    console.log(`Found ${allGames.length} total games`);

    // Loop through all college football games for given year
    for (let i = 0; i < allGames.length; i++) {
        const newGame = checkIfGameIsRelevant(allGames[i], newUniversities, games);
        if (newGame) {
            games.push(newGame);
            
            // Update scores based on game results
            if (newGame.team1.result === Result.win) {
                newUniversities[newGame.team1.id].score += 1;
            }
            if (newGame.team2.result === Result.win) {
                newUniversities[newGame.team2.id].score += 1;
            }
            if (newGame.team1.result === Result.loss) {
                newUniversities[newGame.team1.id].score -= 1;
            }
            if (newGame.team2.result === Result.loss) {
                newUniversities[newGame.team2.id].score -= 1;
            }
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

    return newUniversities;
};