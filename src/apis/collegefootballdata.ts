import axios from 'axios';

// CollegeFootballData.com API
// Free tier: 1,000 calls/month
// Get your API key at: https://collegefootballdata.com/key

const API_KEY = process.env.REACT_APP_CFD_API_KEY || '';
const BASE_URL = 'https://api.collegefootballdata.com';

export const getGames = async (year: number, week?: number) => {
    const params: any = {
        year,
        seasonType: 'regular',
    };
    
    if (week) {
        params.week = week;
    }

    const { data } = await axios.get(`${BASE_URL}/games`, {
        params,
        headers: API_KEY ? {
            'Authorization': `Bearer ${API_KEY}`
        } : {}
    });
    
    return data;
};

export const getTeamGames = async (year: number, teamId: string) => {
    const { data } = await axios.get(`${BASE_URL}/games`, {
        params: {
            year,
            seasonType: 'regular',
            team: teamId
        },
        headers: API_KEY ? {
            'Authorization': `Bearer ${API_KEY}`
        } : {}
    });
    
    return data;
};

