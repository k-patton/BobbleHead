import * as React from "react";
import "./App.css";
import { getScoreboard } from "./apis/scoreboard";
const teams = require("./data/allTeams.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      games: []
    };
  }

  async componentDidMount() {
    console.log("I'm here");
    const data = await getScoreboard("2019", "22");
    console.log(data.events);
    console.log(data.events[0].competitions[0].competitors[0]);
    await this.setState({ games: data.events });
  }
  render() {
    if (!this.state.games) {
      return <h1>Loading...</h1>;
    }
    return (
      <div className="App">
        <img src="./football-logo.png" className="football-logo" alt="logo" />
        <div>
          <h1> It's Bobble Head Tournament Time! </h1>
          <h2> The Games: </h2>
        </div>
        {/* <div>
          <h2> Add new person </h2>
          <button> Add participant </button>
        </div>
        <div>
          <h2> Add new school </h2>
          <button> Add a university </button>
          <h3> A list of all schools: </h3>
        */}
        <div>
          {this.state.games.map((game, index) => (
            <div key={game.id}>
              {game.name}
              <li>The attendence was {game.competitions[0].attendance} </li>
              <li>
                {`${game.competitions[0].competitors[0].team.name} scored ${game.competitions[0].competitors[0].score}`}
              </li>
              <li>
                {`${game.competitions[0].competitors[1].team.name} scored ${game.competitions[0].competitors[1].score}`}
              </li>
              <div>
                {game.competitions[0].competitors[0].winner
                  ? `${game.competitions[0].competitors[0].team.name} won!`
                  : `${game.competitions[0].competitors[1].team.name} won!`}{" "}
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
