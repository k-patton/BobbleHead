# 🏈 BobbleHead Tournament

A fun college football tournament game where players select their favorite college teams and compete based on real game results from the season!

## What It Does

BobbleHead is a fantasy-style game for college football fans. Players choose their college teams (usually their alma maters), and the app automatically calculates scores based on actual game results:
- **+1 point** for each win
- **-1 point** for each loss
- The player with the highest total score wins!

## Features

- 🎯 Real-time score calculation using ESPN's API
- 📊 Automatic team data generation from live games
- 👥 Add and manage multiple players
- 🏆 Winner announcement with rankings
- 📱 Clean, responsive UI

## Getting Started

### Installation

```bash
npm install
```

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

1. **Add Players**: Click "Add player" to add participants with their selected college teams
2. **Find Team IDs**: Use ESPN's website to find team IDs (visible in team URLs)
3. **Calculate Winner**: Click "Find the winner!" to fetch game results and calculate scores
4. **View Results**: See each player's total score and which player won!

## Available Scripts

### `npm start`
Runs the app in development mode

### `npm run build`
Builds the app for production

### `npm test`
Launches the test runner

### `npm run generate-teams [year]`
Generates team data from ESPN API for the specified year

## Project Structure

```
src/
├── apis/           # ESPN API integration
├── components/     # React components
│   ├── AddPlayer/  # Player management
│   └── PlayerCard/ # Player display
├── data/           # JSON data files
├── services/       # Business logic
│   ├── calculateWinner.ts
│   └── generateTeams.ts
└── App.tsx         # Main application
```

## Technologies

- React 17 with TypeScript
- Axios for API calls
- ESPN College Football API
- Create React App

## Notes

- The app fetches data from ESPN's public API
- Team scores are calculated from regular season games (weeks 1-17)
- Both FBS and FCS divisions are included

---

Built with ❤️ for college football fans!
