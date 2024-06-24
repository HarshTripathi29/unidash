import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertContainer from '../Components/AlertContainer';
import './watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [alertInputs, setAlertInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('https://unidash-full-1.onrender.com/api/v1/watchlist');
        setWatchlist(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleAlertInputChange = (tick, value) => {
    setAlertInputs({
      ...alertInputs,
      [tick]: value
    });
  };

  const handleAlertPriceSelect = (tick) => {
    const itemIndex = watchlist.findIndex((runeType) => runeType.tick === tick);
    if (alertInputs[tick] && itemIndex !== -1) {
      const updatedWatchlist = [...watchlist];
      updatedWatchlist[itemIndex].alertPrice = alertInputs[tick];
      setWatchlist(updatedWatchlist);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const alertMessage = watchlist.length === 0 ? 'No items in the watchlist' : `You have ${watchlist.length} items in your watchlist`;

  return (
    <div className="watchlist-table-container">
      {watchlist.some(item => item.alertPrice) && <AlertContainer watchlist={watchlist} />}
      <h1>Watchlist</h1>
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Tick</th>
            <th>Current Price</th>
            <th>Change Price</th>
            <th>BTC Volume</th>
            <th>Amount Volume</th>
            <th>Holders</th>
            <th>Symbol</th>
            <th>Alert Price</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.length > 0 ? (
            watchlist.map((runeType, index) => (
              <tr key={index}>
                <td>{runeType.tick}</td>
                <td>{runeType.curPrice}</td>
                <td>{runeType.changePrice}</td>
                <td>{runeType.btcVolume}</td>
                <td>{runeType.amountVolume}</td>
                <td>{runeType.holders}</td>
                <td><img src={runeType.symbol} alt="symbol" className="symbol-image" /></td>
                <td>
                  <div className="alert-container">
                    <input
                      type="number"
                      value={alertInputs[runeType.tick] || ''}
                      onChange={(e) => handleAlertInputChange(runeType.tick, e.target.value)}
                      className="alert-input"
                    />
                    <button onClick={() => handleAlertPriceSelect(runeType.tick)} className="alert-button">Set</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No items in the watchlist</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
