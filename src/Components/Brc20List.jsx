import React, { useState, useEffect } from 'react';
import { fetchOrdiDetails } from '../runes'; 
import './Brc20List.css'; 

const Brc20List = () => {
  const [brc20Data, setBrc20Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrdiDetails();
        setBrc20Data(data.data.data);
        console.log(Brc20List);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) return <p>Loading BRC20 data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="brc20-list">
      <table className="brc20-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Minted</th>
            <th>Max Supply</th>
            <th>Holders</th>
            <th>Watch List</th>
          </tr>
        </thead>
        <tbody>
          {brc20Data.map((token, index) => (
            <tr key={index}>
              <td>{token.ticker}</td>
              <td>{token.minted}</td>
              <td>{token.max}</td>
              <td>{token.holdersCount}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Brc20List;
