# 🏈 BobbleHead Tournament

A fun college football tournament game where players select their favorite college teams and compete based on real game results from the season!

## What It Does

BobbleHead is a fantasy-style game for college football fans. Players choose their college teams (usually their alma maters), and the app automatically calculates scores based on actual game results:
- **+1 point** for each win
- **-1 point** for each loss
- The player with the highest total score wins!

## Features

- 🎯 Real-time score calculation using CollegeFootballData.com API
- 🎬 Dramatic game-by-game display with animations
- 📊 Automatic team data generation from ALL games (FBS + FCS)
- 👥 Add and manage multiple players
- 🏆 Winner announcement with tie detection
- 🎮 Interactive player cards with game detail modals
- 📋 Collapsible accordion to view all relevant games
- ⏳ Loading screen with progress tracking
- 📱 Clean, responsive UI with modern design

## Getting Started

### Installation

```bash
npm install
```

### Setup API Key (Optional but Recommended)

To get **all** college football games (including FCS vs FBS matchups like Furman vs Clemson):

1. Get a free API key from [CollegeFootballData.com](https://collegefootballdata.com/key)
2. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env`:
   ```
   REACT_APP_CFD_API_KEY=your_api_key_here
   ```

**Note:** The app will work without an API key using ESPN's API, but some games (especially FCS vs FBS) might be missing.

### Generate Team Data

Before running the app, generate the latest team data for the current season:

```bash
npm run generate-teams 2025
```

This fetches all college football teams from the 2025 season and saves them to `src/data/teams.json`.

### Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Play

1. **Setup**: 
   - Add your CollegeFootballData.com API key to `.env`
   - Run `npm run get-cfd-teams` to fetch team data
   - Run `npm run generate-teams-cfd` to generate teams list

2. **Add Players**: 
   - Edit `src/data/currentPlayers.json` or use "Add player" button
   - Find team IDs from `src/data/cfdTeams.json`

3. **Calculate Winner**: 
   - Click "Find the winner!" 
   - Watch the dramatic game-by-game display
   - See scores calculate in real-time

4. **View Results**: 
   - Winner announcement at the top
   - Player cards sorted by score
   - Click any school to see their game details
   - Expand accordion to browse all relevant games

## Available Scripts

### `npm start`
Runs the app in development mode

### `npm run build`
Builds the app for production

### `npm test`
Launches the test runner

### `npm run generate-teams [year]`
Generates team data from ESPN API for the specified year (legacy)

### `npm run generate-all-teams [year]`
Fetches and saves all college football teams to `allTeams.json`

### `npm run record-games [year]`
Records all games from a season to `allGames{YEAR}.json` for analysis

### `npm run get-cfd-teams`
Fetches all teams from CollegeFootballData.com API and creates ID mappings

### `npm run generate-teams-cfd`
Generates `teams.json` using CollegeFootballData.com team information (recommended)

### `npm run update-player-ids`
Updates player team IDs using the corrected CollegeFootballData.com mapping

## Project Structure

```
src/
├── apis/                      # API integrations
│   ├── collegefootballdata.ts # CollegeFootballData.com API
│   └── scoreboard.ts          # ESPN API (fallback)
├── components/                # React components
│   ├── AddPlayer/             # Player management
│   ├── PlayerCard/            # Player cards with scores
│   ├── GameDetailsModal/      # Individual team game details
│   ├── GameProcessingModal/   # Dramatic game display
│   ├── GamesAccordion/        # All games browser
│   └── LoadingScreen/         # Loading animation
├── data/                      # JSON data files
│   ├── currentPlayers.json    # Player configurations
│   ├── teams.json             # Active teams
│   ├── cfdTeams.json          # All CFD teams
│   └── manualGames2025.json   # Manual game additions
├── services/                  # Business logic
│   ├── calculateWinner.ts     # Score calculation
│   └── generateTeams.ts       # Team data generation
└── App.tsx                    # Main application

scripts/
├── generateTeams.js           # Generate teams from ESPN
├── generateTeamsCFD.js        # Generate teams from CFD (recommended)
├── getCollegeFootballDataTeams.js  # Fetch all CFD teams
├── recordAllGames.js          # Record full season games
└── updatePlayerIds.js         # Update team ID mappings
```

## Technologies

- React 17 with TypeScript
- Axios for API calls
- CollegeFootballData.com API (primary)
- ESPN College Football API (fallback)
- Create React App
- CSS Animations & Transitions

## Notes

- The app uses CollegeFootballData.com API for comprehensive game coverage
- Includes ALL games: FBS, FCS, and crossover matchups
- Team scores are calculated from regular season games
- Free API tier: 1,000 calls/month (sufficient for personal use)
- Falls back to ESPN API if CollegeFootballData.com is unavailable
- Manual games can be added via `src/data/manualGames2025.json` if needed

---

Built with ❤️ for college football fans!
