import { getScoreboard } from "../apis/scoreboard";
import { Game, University } from "../App.schema";

// const getTeamScore = (teamId: string, events: any[]) =>{
//     let games = []; 
//     let score = 0; 
//     for (let i = 0; i < events.length; i++){
//         console.log(i); 
//         if (events[i].name.includes("Georgia")){
//             console.log(events[i].name); 
//         }
//         const competitors = events[i].competitions[0].competitors[0]; 
//         if(competitors[0].id === teamId || competitors[0].id === teamId){
//             console.log("Found a relevant game: ", events[i].name); 
//         }
//     }
// }

export const calculateWinner = async (year: string, universities: University[]) => {
    const fbs = await getScoreboard(year,"80"); 
    const fcs = await getScoreboard(year, "81"); 

    const games: Game[] = []; 

    console.log(fbs.events.length); 
    console.log(fbs.events[0]); 

    for (let i = 0; i < fbs.events.length; i++){
        if (fbs.events[i]?.name.includes("Georgia Tech")){
            console.log(fbs.events[i].name); 
            console.log(fbs.events[i].id); 
            if(!games[fbs.events[i].id]) {
                const competitors = fbs.events[i].competitions[0].competitors; 
                let winner, loser; 
                if(competitors[0].winner){
                    winner = competitors[0].id;  
                    loser = competitors[1].id; 
                }
                else{
                    winner = competitors[1].id; 
                    loser = competitors[0].id; 
                }

                games[fbs.events[i].id] = {
                    id: fbs.events[i].id, 
                    name: fbs.events[i].name,
                    winnerId: winner, 
                    loserId: loser, 
                    score: `${competitors[0].score} vs. ${competitors[1].score}`
                }
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