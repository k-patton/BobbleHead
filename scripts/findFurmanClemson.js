const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load API key
let API_KEY = '';
try {
    const envPath = path.join(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/REACT_APP_CFD_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
} catch (e) {}

const BASE_URL = 'https://api.collegefootballdata.com';

async function searchGames() {
    console.log('🔍 Searching for Furman and Clemson games...\n');
    
    const response = await axios.get(`${BASE_URL}/games`, {
        params: { year: 2025, seasonType: 'regular' },
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    
    // Search by team IDs (Furman: 231, Clemson: 228)
    const furmanById = response.data.filter(g => g.homeId === 231 || g.awayId === 231);
    const clemsonById = response.data.filter(g => g.homeId === 228 || g.awayId === 228);
    
    console.log(`Furman games (ID 231): ${furmanById.length}`);
    furmanById.forEach(g => {
        console.log(`  Week ${g.week}: ${g.awayTeam} @ ${g.homeTeam} - ${g.homePoints}-${g.awayPoints}`);
    });
    
    console.log(`\nClemson games (ID 228): ${clemsonById.length}`);
    clemsonById.forEach(g => {
        console.log(`  Week ${g.week}: ${g.awayTeam} @ ${g.homeTeam} - ${g.homePoints}-${g.awayPoints}`);
    });
    
    // Look for the specific matchup
    const furmanVsClemson = response.data.find(g =>
        (g.homeId === 228 && g.awayId === 231) || (g.homeId === 231 && g.awayId === 228)
    );
    
    if (furmanVsClemson) {
        console.log('\n🎯 FOUND Furman vs Clemson!');
        console.log(JSON.stringify(furmanVsClemson, null, 2));
    } else {
        console.log('\n❌ Furman vs Clemson game not found');
    }
}

searchGames().catch(console.error);

