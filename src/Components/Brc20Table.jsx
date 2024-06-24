import React, { useEffect, useState, useRef } from 'react';
import { fetchBrc20Data } from '../fetchBrc20Data';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';

const Brc20Table = () => {
  const dispatch = useDispatch();
  const [brc20Data, setBrc20Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRefs = useRef({});

  useEffect(() => {
    const getBrc20Data = async () => {
      try {
        const data = await fetchBrc20Data();
        setBrc20Data(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getBrc20Data();
  }, []);

  const handleCheckboxChange = (token) => async (event) => {
    if (event.target.checked) {
      dispatch(addToWatchlist(token));
    } else {
      dispatch(removeFromWatchlist(token.tick));
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="table-container">
      {loading ? (
        <div className="spinner-container">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Tick</th>
              <th>Current Price</th>
              <th>Change Price</th>
              <th>BTC Volume</th>
              <th>Amount Volume</th>
              <th>Holders</th>
              <th>Symbol</th>
              <th>Watch List</th>
            </tr>
          </thead>
          <tbody>
            {brc20Data.length > 0 ? (
              brc20Data.map((token, index) => (
                <tr key={index} ref={(el) => (tableRefs.current[token.tick] = el)}>
                  <td>{token.tick}</td>
                  <td>{token.curPrice}</td>
                  <td>{token.changePrice}</td>
                  <td>{token.btcVolume}</td>
                  <td>{token.amountVolume}</td>
                  <td>{token.holders}</td>
                  <td>{token.symbol}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange(token)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Brc20Table;
