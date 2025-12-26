const fs = require('fs');
const path = require('path');

const playersPath = path.join(__dirname, '../src/data/currentPlayers.json');
const mappingPath = path.join(__dirname, '../src/data/teamIdMappingCorrected.json');

const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

console.log('🔄 Updating player team IDs...\n');

let updated = 0;
let notFound = [];

players.forEach(player => {
    if (player.schools) {
        player.schools.forEach(school => {
            const teamInfo = mapping[school.name];
            if (teamInfo) {
                const oldId = school.id;
                school.id = teamInfo.id.toString();
                if (oldId !== school.id) {
                    console.log(`  ✓ ${player.name}: ${school.name} (${oldId} → ${school.id})`);
                    updated++;
                }
            } else {
                console.log(`  ✗ ${player.name}: ${school.name} - NOT FOUND IN MAPPING`);
                notFound.push(school.name);
            }
        });
    }
});

// Save updated players
fs.writeFileSync(playersPath, JSON.stringify(players, null, 4));

console.log(`\n✅ Updated ${updated} team IDs`);
if (notFound.length > 0) {
    console.log(`⚠️  Teams not found: ${notFound.join(', ')}`);
}
console.log(`✅ Saved to ${playersPath}\n`);

