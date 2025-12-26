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

const generateAllTeams = async (year) => {
    const teams = {};

    try {
        console.log(`\n🏈 Fetching ALL college football teams for year ${year}...\n`);
        
        // Fetch multiple weeks to get all teams throughout the season
        const allEvents = [];
        
        for (let week = 1; week <= 17; week++) {
            try {
                process.stdout.write(`  Week ${week}...`);
                const fbs = await getScoreboard(year, "80", week);
                const fcs = await getScoreboard(year, "81", week);
                
                if (fbs.events) allEvents.push(...fbs.events);
                if (fcs.events) allEvents.push(...fcs.events);
                process.stdout.write(` ✓\n`);
            } catch (err) {
                process.stdout.write(` (no data)\n`);
            }
        }

        console.log(`\nFound ${allEvents.length} total games`);

        // Extract unique teams from all games
        allEvents.forEach((event) => {
            if (event.competitions && event.competitions[0]) {
                const competitors = event.competitions[0].competitors;

                competitors.forEach((competitor) => {
                    const teamId = competitor.team.id;
                    const displayName = competitor.team.displayName;
                    const abbreviation = competitor.team.abbreviation;
                    const location = competitor.team.location;

                    // Only add if we haven't seen this team before
                    if (!teams[teamId]) {
                        teams[teamId] = {
                            id: teamId,
                            displayName,
                            abbreviation,
                            location,
                            score: 0,
                        };
                    }
                });
            }
        });

        console.log(`\nFound ${Object.keys(teams).length} unique teams\n`);

        // Convert to array and sort by display name
        const teamsArray = Object.values(teams).sort((a, b) => 
            a.displayName.localeCompare(b.displayName)
        );

        // Save to allTeams.json
        const teamsPath = path.join(__dirname, "../src/data/allTeams.json");
        fs.writeFileSync(teamsPath, JSON.stringify(teamsArray, null, 2));

        console.log(`✅ Successfully saved ${teamsArray.length} teams to allTeams.json\n`);
        
        // Check if specific team exists
        const gwTeam = teamsArray.find(t => 
            t.displayName.includes("George Washington") || 
            t.location?.includes("George Washington")
        );
        
        if (gwTeam) {
            console.log("Found George Washington:", gwTeam);
        } else {
            console.log("⚠️  George Washington not found in ${year} season data");
            console.log("Searching for similar teams:");
            const gwLike = teamsArray.filter(t => 
                t.displayName.toLowerCase().includes("washington") ||
                t.location?.toLowerCase().includes("washington")
            );
            gwLike.forEach(t => console.log(`  - ${t.id}: ${t.displayName}`));
        }

        return teamsArray;
    } catch (error) {
        console.error("❌ Error fetching teams:", error.message);
        throw error;
    }
};

// Run the script
const year = process.argv[2] || "2025";
console.log(`Starting team fetch for ${year}...`);

generateAllTeams(year)
    .then(() => {
        console.log("\n✅ Done!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Failed:", error.message);
        process.exit(1);
    });

