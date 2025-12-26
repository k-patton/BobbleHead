import { getScoreboard } from "../apis/scoreboard";
import * as fs from "fs";
import * as path from "path";

interface TeamData {
    [key: string]: {
        displayName: string;
        score: number;
    };
}

/**
 * Fetches team data from ESPN API and builds a teams object
 * @param year - The year to fetch games from
 * @returns Object mapping team IDs to team info
 */
export const generateTeamsFromAPI = async (year: string): Promise<TeamData> => {
    const teams: TeamData = {};

    try {
        // Fetch both FBS and FCS games
        const fbs = await getScoreboard(year, "80");
        const fcs = await getScoreboard(year, "81");

        const allEvents = [...(fbs.events || []), ...(fcs.events || [])];

        console.log(`Found ${allEvents.length} total games`);

        // Extract unique teams from all games
        allEvents.forEach((event: any) => {
            if (event.competitions && event.competitions[0]) {
                const competitors = event.competitions[0].competitors;

                competitors.forEach((competitor: any) => {
                    const teamId = competitor.team.id;
                    const displayName = competitor.team.displayName;

                    // Only add if we haven't seen this team before
                    if (!teams[teamId]) {
                        teams[teamId] = {
                            displayName,
                            score: 0,
                        };
                    }
                });
            }
        });

        console.log(`Found ${Object.keys(teams).length} unique teams`);
        return teams;
    } catch (error) {
        console.error("Error fetching teams:", error);
        throw error;
    }
};

/**
 * Filters teams to only include those selected by players
 * @param allTeams - All available teams
 * @param playerTeamIds - Array of team IDs that players have selected
 * @returns Filtered teams object
 */
export const filterTeamsForPlayers = (
    allTeams: TeamData,
    playerTeamIds: string[]
): TeamData => {
    const filteredTeams: TeamData = {};

    playerTeamIds.forEach((teamId) => {
        if (allTeams[teamId]) {
            filteredTeams[teamId] = allTeams[teamId];
        } else {
            console.warn(`Team ID ${teamId} not found in fetched teams`);
        }
    });

    return filteredTeams;
};

/**
 * Generates and saves teams.json file based on current players
 * @param year - The year to fetch games from (e.g., "2024")
 */
export const generateAndSaveTeams = async (year: string): Promise<void> => {
    try {
        // Load current players
        const playersPath = path.join(__dirname, "../data/currentPlayers.json");
        const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

        // Extract all unique team IDs from players
        const playerTeamIds: string[] = [];
        playersData.forEach((player: any) => {
            if (player.schools) {
                player.schools.forEach((school: any) => {
                    if (school.id && !playerTeamIds.includes(school.id)) {
                        playerTeamIds.push(school.id);
                    }
                });
            }
        });

        console.log(`Found ${playerTeamIds.length} unique teams from players`);

        // Fetch all teams from API
        const allTeams = await generateTeamsFromAPI(year);

        // Filter to only include player teams
        const filteredTeams = filterTeamsForPlayers(allTeams, playerTeamIds);

        // Save to teams.json
        const teamsPath = path.join(__dirname, "../data/teams.json");
        fs.writeFileSync(teamsPath, JSON.stringify(filteredTeams, null, 4));

        console.log(`Successfully saved ${Object.keys(filteredTeams).length} teams to teams.json`);
        console.log("Teams saved:", Object.keys(filteredTeams).map(id => `${id}: ${filteredTeams[id].displayName}`).join("\n"));
    } catch (error) {
        console.error("Error generating teams:", error);
        throw error;
    }
};

// If run directly as a script
if (require.main === module) {
    const year = process.argv[2] || "2025";
    console.log(`Generating teams for year ${year}...`);
    generateAndSaveTeams(year)
        .then(() => {
            console.log("Done!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Failed:", error);
            process.exit(1);
        });
}

