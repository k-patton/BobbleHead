import axios from 'axios';

export const getScoreboard = async (year: string, groups: string, week?: number) => {
    let url = `http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?seasontype=2&groups=${groups}&limit=1000`;
    
    if (week) {
        url += `&week=${week}`;
    }
    
    url += `&dates=${year}`;
    
    const { data } = await axios.get(url);
    return data;
};
