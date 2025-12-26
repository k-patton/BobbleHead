const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Try to load from .env file
let API_KEY = process.env.CFD_API_KEY || process.env.REACT_APP_CFD_API_KEY || '';

if (!API_KEY) {
    try {
        const envPath = path.join(__dirname, '../.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/REACT_APP_CFD_API_KEY=(.+)/);
        if (match) {
            API_KEY = match[1].trim();
        }
    } catch (e) {
        // No .env file
    }
}

if (!API_KEY) {
    console.error('❌ No API key found!');
    console.error('Please add your API key to .env file as:');
    console.error('  REACT_APP_CFD_API_KEY=your_key_here');
    console.error('\nOr pass it as an environment variable:');
    console.error('  CFD_API_KEY=your_key npm run get-cfd-teams');
    process.exit(1);
}

console.log('✓ API key found\n');

const getTeams = async () => {
    try {
        console.log('\n🏈 Fetching teams from CollegeFootballData.com...\n');
        
        const { data } = await axios.get('https://api.collegefootballdata.com/teams', {
            headers: API_KEY ? {
                'Authorization': `Bearer ${API_KEY}`
            } : {}
        });
        
        console.log(`Found ${data.length} teams\n`);
        
        // Create a lookup by school name
        const teamLookup = {};
        data.forEach(team => {
            teamLookup[team.school] = {
                id: team.id,
                school: team.school,
                mascot: team.mascot,
                abbreviation: team.abbreviation,
                conference: team.conference,
                division: team.division,
                color: team.color,
                alt_color: team.alt_color
            };
        });
        
        // Save to file
        const outputPath = path.join(__dirname, '../src/data/cfdTeams.json');
        fs.writeFileSync(outputPath, JSON.stringify(teamLookup, null, 2));
        
        console.log(`✅ Saved team lookup to cfdTeams.json\n`);
        
        // Now let's find the IDs for teams in currentPlayers
        const playersPath = path.join(__dirname, '../src/data/currentPlayers.json');
        const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
        
        console.log('Teams used by players:\n');
        const uniqueTeams = new Set();
        
        players.forEach(player => {
            if (player.schools) {
                player.schools.forEach(school => {
                    uniqueTeams.add(school.name);
                });
            }
        });
        
        const teamMapping = {};
        Array.from(uniqueTeams).sort().forEach(teamName => {
            // Try to find matching team
            const match = data.find(t => 
                t.school.toLowerCase().includes(teamName.toLowerCase()) ||
                teamName.toLowerCase().includes(t.school.toLowerCase())
            );
            
            if (match) {
                teamMapping[teamName] = {
                    id: match.id,
                    school: match.school,
                    oldId: players.flatMap(p => p.schools || [])
                        .find(s => s.name === teamName)?.id
                };
                console.log(`  ✓ ${teamName} → ${match.school} (ID: ${match.id})`);
            } else {
                console.log(`  ✗ ${teamName} → NOT FOUND`);
            }
        });
        
        // Save mapping
        const mappingPath = path.join(__dirname, '../src/data/teamIdMapping.json');
        fs.writeFileSync(mappingPath, JSON.stringify(teamMapping, null, 2));
        
        console.log(`\n✅ Saved ID mapping to teamIdMapping.json\n`);
        
        return teamLookup;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        throw error;
    }
};

getTeams()
    .then(() => {
        console.log('✅ Done!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

