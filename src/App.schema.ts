export interface School {
    displayName: string; 
    score: number; 
}
export interface Participant {
    name: string; 
    schools: string[]; 
    score: number;  
}

export enum Result {
    win="WIN", 
    loss="LOSS", 
    tie="TIE"
}
export interface TeamGameInfo {
    id: string; 
    name: string; 
    score: string; 
    result: Result; 
}

export interface Game {
    id: string; 
    name: string; 
    team1: TeamGameInfo; 
    team2: TeamGameInfo; 
}