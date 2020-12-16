import { getScoreboard } from "../apis/scoreboard";
import { Game, Result, University } from "../App.schema";

const checkIfGameIsRelevant = (event: any, universities: University[], games: Game[])=> {

    const competitors = event.competitions[0].competitors;

    // if both competitors are universities on our list, then we care about this game
    if (universities.some(t => competitors[0].team.displayName.includes(t.name)) &&  universities.some(t => competitors[1].team.displayName.includes(t.name))){

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


export const calculateWinner = async (year: string, universities: University[]) => {

    const fbs = await getScoreboard(year,"80");  
    const fcs = await getScoreboard(year, "81"); 

    const allGames = fbs.events.concat(fcs.events); 

    const games: Game[] = []; 

    console.log(fbs.events.length); 
    console.log(fbs.events[0]); 

    for (let i = 0; i < allGames.length; i++){
        const newGame = checkIfGameIsRelevant(allGames[i], universities, games); 
        if(newGame){
            games.push(newGame); 
        }
    }

    console.log(games);
    console.log(games.length);

}