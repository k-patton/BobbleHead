import { getScoreboard } from "../apis/scoreboard";
import { Game, Participant, Result } from "../App.schema";

const checkIfGameIsRelevant = (event: any, universities: any, games: Game[])=> {

    const competitors = event.competitions[0].competitors;

    // if both competitors are universities on our list, then we care about this game
    // if (universities.some(t => competitors[0].team.displayName.includes(t.name)) &&  universities.some(t => competitors[1].team.displayName.includes(t.name))){
    
    if(universities[competitors[0].team.id] && universities[competitors[1].team.id]){

        //if we haven't already added this game to our array 
        if(!games.find(g => g.id === event.id)){
            return {
                id: event.id, 
                name: event.name,
                team1: {
                    id: competitors[0].id, 
                    name: competitors[0].team.displayName, 
                    score: competitors[0].score,
                    result: competitors[0].winner === true ? Result.win:  competitors[0].winner === false ? Result.loss : Result.tie
                },
                team2: {
                    id: competitors[1].id, 
                    name: competitors[1].team.displayName, 
                    score: competitors[1].score,
                    result: competitors[1].winner === true ? Result.win:  competitors[1].winner === false ? Result.loss : Result.tie
                }
            }
        }
    }

}


export const calculateWinner = async (year: string, universities: any, players: Participant[]) => {

    const fbs = await getScoreboard(year,"80");  
    const fcs = await getScoreboard(year, "81"); 

    const allGames = fbs.events.concat(fcs.events); 

    const games: Game[] = []; 

    const newUniversities = universities; 

    console.log(fbs.events.length); 
    console.log(fbs.events[0]); 

    // looping through all college football games for given year 
    for (let i = 0; i < allGames.length; i++){
        const newGame = checkIfGameIsRelevant(allGames[i], universities, games); 
        if(newGame){
            games.push(newGame); 
            if(newGame.team1.result === "WIN"){
                newUniversities[newGame.team1.id].score += 1;  
            }   
            if(newGame.team2.result === "WIN"){
                newUniversities[newGame.team2.id].score += 1;  
            }
            if(newGame.team1.result === "LOSS"){
                newUniversities[newGame.team1.id].score -= 1;  
            }   
            if(newGame.team2.result === "LOSS"){
                newUniversities[newGame.team2.id].score -= 1;  
            }
        }
    }
    // console.log(games);
    // console.log(games.length);

    console.log(newUniversities); 


    for (let i = 0; i < players.length; i++) {
        let score = 0;
        let player = players[i];
        for (let j = 0; j < player.schools.length; j++) {
          let id = player.schools[j].id;
        //   console.log(id, "score");
          if (newUniversities) {
            // console.log(newUniversities[id].score);
            score += newUniversities[id].score; 
          }
        }
        console.log(player.name + "'s score is: " + score); 
    }

}