const fs = require('fs');
const path = require('path');

const playersPath = path.join(__dirname, '../src/data/currentPlayers.json');
const cfdTeamsPath = path.join(__dirname, '../src/data/cfdTeams.json');
const outputPath = path.join(__dirname, '../src/data/teams.json');

console.log('\n🏈 Generating teams.json from CollegeFootballData.com teams...\n');

const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
const cfdTeams = JSON.parse(fs.readFileSync(cfdTeamsPath, 'utf8'));

// Extract all unique team IDs from players
const playerTeamIds = new Set();
players.forEach(player => {
    if (player.schools) {
        player.schools.forEach(school => {
            if (school.id) {
                playerTeamIds.add(school.id);
            }
        });
    }
});

console.log(`Found ${playerTeamIds.size} unique teams from players\n`);

// Build teams object
const teams = {};
let found = 0;
let notFound = [];

playerTeamIds.forEach(teamId => {
    // Find team in cfdTeams
    const team = Object.values(cfdTeams).find(t => t.id.toString() === teamId);
    
    if (team) {
        teams[teamId] = {
            displayName: `${team.school} ${team.mascot}`,
            school: team.school,
            mascot: team.mascot,
            abbreviation: team.abbreviation,
            conference: team.conference,
            score: 0
        };
        console.log(`  ✓ ${teamId}: ${teams[teamId].displayName}`);
        found++;
    } else {
        console.log(`  ✗ ${teamId}: NOT FOUND`);
        notFound.push(teamId);
    }
});

// Save teams.json
fs.writeFileSync(outputPath, JSON.stringify(teams, null, 4));

console.log(`\n✅ Generated teams.json with ${found} teams`);
if (notFound.length > 0) {
    console.log(`⚠️  Teams not found: ${notFound.join(', ')}`);
}
console.log(`✅ Saved to ${outputPath}\n`);

