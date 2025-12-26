const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load API key from .env
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
        console.error('❌ Could not load .env file');
    }
}

if (!API_KEY) {
    console.error('❌ No API key found!');
    console.error('Set CFD_API_KEY environment variable or add to .env file');
    process.exit(1);
}

console.log('✓ API key found:', API_KEY.substring(0, 10) + '...\n');

const BASE_URL = 'https://api.collegefootballdata.com';

async function testAPI() {
    const year = 2025;
    
    console.log(`🏈 Testing CollegeFootballData.com API for ${year}...\n`);
    
    try {
        console.log('Request details:');
        console.log(`  URL: ${BASE_URL}/games`);
        console.log(`  Params: { year: ${year}, seasonType: 'regular' }`);
        console.log(`  Headers: { Authorization: 'Bearer ${API_KEY.substring(0, 10)}...' }\n`);
        
        const response = await axios.get(`${BASE_URL}/games`, {
            params: {
                year: year,
                seasonType: 'regular'
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        console.log('✅ Success!\n');
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Total games returned: ${response.data.length}\n`);
        
        if (response.data.length > 0) {
            console.log('First game:');
            console.log(JSON.stringify(response.data[0], null, 2));
            console.log('\n---\n');
            
            // Look for Furman vs Clemson
            const furmanClemson = response.data.find(game => 
                (game.home_team === 'Clemson' && game.away_team === 'Furman') ||
                (game.home_team === 'Furman' && game.away_team === 'Clemson')
            );
            
            if (furmanClemson) {
                console.log('✅ Found Furman vs Clemson game!');
                console.log(JSON.stringify(furmanClemson, null, 2));
            } else {
                console.log('⚠️  Furman vs Clemson not found');
                
                // Look for any Furman games
                const furmanGames = response.data.filter(game =>
                    game.home_team === 'Furman' || game.away_team === 'Furman'
                );
                console.log(`\nFound ${furmanGames.length} Furman games:`);
                furmanGames.forEach(game => {
                    console.log(`  - ${game.away_team} @ ${game.home_team} (${game.start_date})`);
                });
                
                // Look for any Clemson games
                const clemsonGames = response.data.filter(game =>
                    game.home_team === 'Clemson' || game.away_team === 'Clemson'
                );
                console.log(`\nFound ${clemsonGames.length} Clemson games:`);
                clemsonGames.slice(0, 5).forEach(game => {
                    console.log(`  - ${game.away_team} @ ${game.home_team} (${game.start_date})`);
                });
            }
        } else {
            console.log('⚠️  No games returned from API');
            console.log('This could mean:');
            console.log('  1. The 2025 season data is not available yet');
            console.log('  2. The API requires different parameters');
            console.log('  3. Try with year: 2024 instead');
        }
        
    } catch (error) {
        console.error('❌ Error testing API:\n');
        if (error.response) {
            console.error(`Status: ${error.response.status} ${error.response.statusText}`);
            console.error('Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received');
            console.error(error.message);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// Also test with 2024 to compare
async function testBothYears() {
    await testAPI();
    
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('Testing with 2024 for comparison...\n');
    
    try {
        const response2024 = await axios.get(`${BASE_URL}/games`, {
            params: {
                year: 2024,
                seasonType: 'regular'
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        console.log(`✅ 2024: ${response2024.data.length} games found\n`);
        
        if (response2024.data.length > 0) {
            console.log('Sample 2024 game:');
            console.log(JSON.stringify(response2024.data[0], null, 2));
        }
        
    } catch (error) {
        console.error('❌ 2024 test failed:', error.message);
    }
}

testBothYears()
    .then(() => {
        console.log('\n✅ Test complete!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    });

