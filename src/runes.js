import axios from 'axios';

const BASE_URL = 'https://open-api.unisat.io/v3/';
const API_KEY = '0de01e1a5e9c496a1b60eb0ba7c7433f04b2a4c16fd2fb50229f6c1f581241f3'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'accept': 'application/json'
  }
});

export const fetchRunesTypes = async () => {
  try {
    const response = await api.post('market/runes/auction/runes_types', {});
    console.log('Runes Types API response:', response.data.data.list);
    return response.data.data.list;
  } catch (error) {
    console.error('Error fetching Runes Types:', error.toJSON ? error.toJSON() : error);
    throw error;
  }
};

export const fetchLatestPrices = async (watchlist) => {
  try {
    const updatedPrices = await Promise.all(watchlist.map(async (item) => {
      const response = await api.post('market/runes/auction/runes_types', { tick: item.tick });
      const updatedItem = response.data.data.list.find(rune => rune.tick === item.tick);
      return {
        ...item,
        curPrice: updatedItem.curPrice,
      };
    }));
    return updatedPrices;
  } catch (error) {
    console.error('Error fetching latest prices:', error.toJSON ? error.toJSON() : error);
    throw error;
  }
};


const ORDISCAN_API_URL = 'https://api.ordiscan.com/v1/';
const ORDISCAN_API_KEY = '903fbf4c-3966-41d6-8643-f94784934f3d'; 

const ordiscanApi = axios.create({
  baseURL: ORDISCAN_API_URL,
  headers: {
    'Authorization': `Bearer ${ORDISCAN_API_KEY}`,
    'accept': 'application/json'
  }
});

export const fetchOrdiDetails = async () => {
  try {
    const response = await ordiscanApi.get('brc20/ordi');
    console.log('Ordi Details API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Ordi details:', error.toJSON ? error.toJSON() : error);
    throw error;
  }
};
