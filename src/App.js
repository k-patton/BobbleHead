import * as React from "react";
import "./App.css";
import { teamApi } from "./api/teamData";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://api.collegefootballdata.com/teams")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result.data
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  render() {
    const { error, isLoaded, items } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src="./football-logo.png" className="football-logo" alt="logo" />
          <div>
            <h1> It's Bobble Head Tournament Time! </h1>
          </div>
          <div>
            <h1> ... </h1>
          </div>
          <div>
            <h2> The current players and their schools are: </h2>
            {isLoaded && !error && (
              <div>
                <ul>
                  {items.map(item => (
                    <li key={item.name}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
