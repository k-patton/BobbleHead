const axios = require('axios');
const fs = require('fs');
const path = require('path');

const getScoreboard = async (year, groups, week = null) => {
    let url = `http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=2&groups=${groups}&limit=1000`;
    
    if (week) {
        url += `&week=${week}`;
    }
    
    url += `&dates=${year}`;
    
    const { data } = await axios.get(url);
    return data;
};

const generateTeamsFromAPI = async (year) => {
    const teams = {};

    try {
        console.log(`Fetching games for year ${year}...`);
        
        // Fetch multiple weeks to get all teams throughout the season
        // College football regular season typically has ~15 weeks
        const allEvents = [];
        
        for (let week = 1; week <= 17; week++) {
            try {
                console.log(`  Fetching week ${week}...`);
                const fbs = await getScoreboard(year, "80", week);
                const fcs = await getScoreboard(year, "81", week);
                
                if (fbs.events) allEvents.push(...fbs.events);
                if (fcs.events) allEvents.push(...fcs.events);
            } catch (err) {
                // Week might not exist, continue
                console.log(`  Week ${week} - no data or error`);
            }
        }

        console.log(`Found ${allEvents.length} total games`);

        // Extract unique teams from all games
        allEvents.forEach((event) => {
            if (event.competitions && event.competitions[0]) {
                const competitors = event.competitions[0].competitors;

                competitors.forEach((competitor) => {
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

const filterTeamsForPlayers = (allTeams, playerTeamIds) => {
    const filteredTeams = {};

    playerTeamIds.forEach((teamId) => {
        if (allTeams[teamId]) {
            filteredTeams[teamId] = allTeams[teamId];
        } else {
            console.warn(`⚠️  Team ID ${teamId} not found in fetched teams`);
        }
    });

    return filteredTeams;
};

const generateAndSaveTeams = async (year) => {
    try {
        // Load current players
        const playersPath = path.join(__dirname, "../src/data/currentPlayers.json");
        const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

        // Extract all unique team IDs from players
        const playerTeamIds = [];
        playersData.forEach((player) => {
            if (player.schools) {
                player.schools.forEach((school) => {
                    if (school.id && !playerTeamIds.includes(school.id)) {
                        playerTeamIds.push(school.id);
                    }
                });
            }
        });

        console.log(`\nFound ${playerTeamIds.length} unique teams from players:`);
        console.log(playerTeamIds.join(", "));

        // Fetch all teams from API
        const allTeams = await generateTeamsFromAPI(year);

        // Filter to only include player teams
        const filteredTeams = filterTeamsForPlayers(allTeams, playerTeamIds);

        // Save to teams.json
        const teamsPath = path.join(__dirname, "../src/data/teams.json");
        fs.writeFileSync(teamsPath, JSON.stringify(filteredTeams, null, 4));

        console.log(`\n✅ Successfully saved ${Object.keys(filteredTeams).length} teams to teams.json\n`);
        console.log("Teams saved:");
        Object.keys(filteredTeams).forEach(id => {
            console.log(`  ${id}: ${filteredTeams[id].displayName}`);
        });
    } catch (error) {
        console.error("❌ Error generating teams:", error);
        throw error;
    }
};

// Run the script
const year = process.argv[2] || "2024";
console.log(`\n🏈 Generating teams for year ${year}...\n`);

generateAndSaveTeams(year)
    .then(() => {
        console.log("\n✅ Done!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Failed:", error.message);
        process.exit(1);
    });

