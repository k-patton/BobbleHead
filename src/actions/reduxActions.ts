export const FETCH_TEAMS = "FETCH_TEAMS"
export const FETCH_TEAMS_SUCCESS = "FETCH_TEAMS_SUCCESS"
export const FETCH_TEAMS_FAILURE = "FETCH_TEAMS_FAILURE"

export const GET_MATCHUP = "GET_MATCHUP"
export const GET_MATCHUP_SUCCESS = "GET_MATCHUP_SUCCESS"


export const fetchTeamsAction = () => ({
    type: FETCH_TEAMS
})

export const fetchTeamsSuccessAction = (teams : any) => ({
    type: FETCH_TEAMS_SUCCESS, 
    teams
})