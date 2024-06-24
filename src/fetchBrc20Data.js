import axios from 'axios';

const BASE_URL = 'https://api.ordiscan.com/v1/';
const API_KEY = '903fbf4c-3966-41d6-8643-f94784934f3d';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'accept': 'application/json'
  }
});

export const fetchBrc20Data = async () => {
  try {
    const response = await api.get('brc20/ordi');
    console.log('BRC20 Data API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching BRC20 Data:', error.toJSON ? error.toJSON() : error);
    throw error;
  }
};
