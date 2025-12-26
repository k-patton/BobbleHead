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

const recordAllGames = async (year) => {
    const allGames = [];

    try {
        console.log(`\n🏈 Fetching ALL games for year ${year}...\n`);
        
        // Fetch multiple weeks to get all games throughout the season
        for (let week = 1; week <= 17; week++) {
            try {
                process.stdout.write(`  Week ${week}...`);
                const fbs = await getScoreboard(year, "80", week);
                const fcs = await getScoreboard(year, "81", week);
                
                if (fbs.events) allGames.push(...fbs.events);
                if (fcs.events) allGames.push(...fcs.events);
                process.stdout.write(` ✓\n`);
            } catch (err) {
                process.stdout.write(` (no data)\n`);
            }
        }

        console.log(`\nFound ${allGames.length} total games`);

        // Save to file with year in filename
        const filename = `allGames${year}.json`;
        const filePath = path.join(__dirname, `../src/data/${filename}`);
        fs.writeFileSync(filePath, JSON.stringify(allGames, null, 2));

        console.log(`\n✅ Successfully saved ${allGames.length} games to ${filename}\n`);
        
        // Also create a summary
        const summary = {
            year: year,
            totalGames: allGames.length,
            dateRecorded: new Date().toISOString(),
            filename: filename
        };
        
        console.log("Summary:", summary);
        
        return allGames;
    } catch (error) {
        console.error("❌ Error fetching games:", error.message);
        throw error;
    }
};

// Run the script
const year = process.argv[2] || "2025";
console.log(`Starting game recording for ${year}...`);

recordAllGames(year)
    .then(() => {
        console.log("\n✅ Done!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Failed:", error.message);
        process.exit(1);
    });

