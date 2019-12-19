import { getScoreboard } from "../apis/scoreboard"


export const getTeamGames = (team:string)=>{
    const data = getScoreboard("2019", "22")
    console.log(data)
}