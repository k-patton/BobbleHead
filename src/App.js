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
      return <>Loading...</>;
    }
    return (
      <div className="App">
        <img src="./football-logo.png" className="football-logo" alt="logo" />
        <div>
          <h1> It's Bobble Head Tournament Time! </h1>
        </div>
        <div>
          <h1> ... </h1>
        </div>
        <div>
          <h2> The current players and their schools are: </h2>
        </div>
        <div>
          <h2> Add new person </h2>
          <button> Add participant </button>
        </div>
        <div>
          <h2> Add new school </h2>
          <button> Add a university </button>
          <h3> A list of all schools: </h3>
          <div>
            <ul>
              {this.state.games[0].competitions[0].competitors[0].team.location}
              's score was
              {this.state.games[0].competitions[0].competitors[0].team}
              {/* {this.state.games.map(game => (
                <div>
                  <div>
                    The teams are: {game.competitions[0].competitors[0]}
                  </div>
                  <div>and</div>
                  <div>{game.competitions[0].competitors[1]} </div>
                </div>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
