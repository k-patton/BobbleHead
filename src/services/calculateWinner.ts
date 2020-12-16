import { getScoreboard } from "../apis/scoreboard";
import { Game, University } from "../App.schema";

const checkIfRelevant = (id: string, universities: string)=>{

}


export const calculateWinner = async (year: string, universities: University[]) => {

    const fbs = await getScoreboard(year,"80"); 
    const fcs = await getScoreboard(year, "81"); 

    const games: Game[] = []; 

    console.log(fbs.events.length); 
    console.log(fbs.events[0]); 

    for (let i = 0; i < fbs.events.length; i++){
        const name = fbs.events[i].name; 
        if (universities.some(t => name.includes(t.name))){
            console.log(fbs.events[i].name); 
            console.log(fbs.events[i].id); 
            if(!games.find(g => g.id === fbs.events[i].id)){
                const competitors = fbs.events[i].competitions[0].competitors; 
                let winner, loser; 
                if(competitors[0].winner){
                    winner = competitors[0];  
                    loser = competitors[1]; 
                }
                else{
                    winner = competitors[1]; 
                    loser = competitors[0]; 
                }

                games.push({
                    id: fbs.events[i].id, 
                    name: fbs.events[i].name,
                    winner: {
                        id: winner.id, 
                        name: winner.team.displayName, 
                        score: winner.score
                    },
                    loser: {
                        id: loser.id, 
                        name: loser.team.displayName, 
                        score: loser.score
                    }
                })
            }
        }
    }

    console.log(games);
    console.log(games.length);

    // const relevantGames = []; 
    // universities.forEach((school) =>{
    //     console.log("helo"); 
    //     getTeamScore(school.id, fbs); 
    // })

}