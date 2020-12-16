import axios from 'axios';

export const getScoreboard = async (year: string, groups: string) => {
    const { data } = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${year}&groups=${groups}&limit=800`); 
    return data;
};
