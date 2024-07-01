import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Brc20List.css';

const API_KEY = '0de01e1a5e9c496a1b60eb0ba7c7433f04b2a4c16fd2fb50229f6c1f581241f3';

const Brc20List = () => {
  const [brc20Data, setBrc20Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://open-api.unisat.io/v3/market/brc20/auction/brc20_types', {
          "ticks": [
            "ordi",
            "meme",
            "punk",
            "pepe",
            "BRUH",
            "gold",
            "BAYC",
            "<10K",
            "sats",
            "sato",
            "pizza"
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        });
        setBrc20Data(response.data.data.list);
        console.log(response.data);
        console.log(response.data.data.list);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (token) => async (event) => {
    if (event.target.checked) {
      try {
        const response = await axios.post('https://unidash-full.onrender.com/api/v1/brc20Watchlist', {
          tick: token.tick,
          curPrice: token.curPrice,
          changePrice: token.changePrice,
          btcVolume: token.btcVolume,
          amountVolume: token.amountVolume,
          holders: token.holders,
          transactions: token.transactions,
        });
        console.log('Post response:', response.data);
      } catch (error) {
        console.error('Error adding to watchlist:', error.response ? error.response.data : error.message);
      }
    } else {
      try {
        const response = await axios.delete(`https://unidash-full-1.onrender.com/api/v1/brc20Watchlist/${token.tick}`);
        console.log('Delete response:', response.data);
      } catch (error) {
        console.error('Error removing from watchlist:', error.response ? error.response.data : error.message);
      }
    }
  };
  

  if (loading) return <p>Loading BRC20 data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="brc20-list">
      <table className="brc20-table">
        <thead>
          <tr>
            <th>Tick</th>
            <th>Current Price</th>
            <th>Change Price</th>
            <th>BTC Volume</th>
            <th>Amount Volume</th>
            <th>Holders</th>
            <th>Transactions</th>
            <th>Watchlist</th>
          </tr>
        </thead>
        <tbody>
  {brc20Data.map((token, index) => (
    <tr key={index}>
      <td>{token.tick}</td>
      <td>{token.curPrice}</td>
      <td>{token.changePrice}</td>
      <td>{token.btcVolume}</td>
      <td>{token.amountVolume}</td>
      <td>{token.holders}</td>
      <td>{token.transactions}</td>
      <td>
        <input type="checkbox" onChange={handleCheckboxChange(token)}/>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default Brc20List;
