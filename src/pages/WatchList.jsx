import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './watchlist.css';
import AlertContainer from '../Components/AlertContainer';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [brc20Watchlist, setBrc20Watchlist] = useState([]);
  const [alertInputs, setAlertInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const watchlistResponse = await axios.get('https://unidash-full.onrender.com/api/v1/watchlist');
        setWatchlist(watchlistResponse.data);

        const brc20WatchlistResponse = await axios.get('https://unidash-full.onrender.com/api/v1/brc20Watchlist');
        setBrc20Watchlist(brc20WatchlistResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlists();
  }, []);

  const handleAlertInputChange = (tick, value) => {
    setAlertInputs({
      ...alertInputs,
      [tick]: value
    });
  };

  const handleAlertPriceSelect = (tick, isBrc20) => {
    const list = isBrc20 ? brc20Watchlist : watchlist;
    const setList = isBrc20 ? setBrc20Watchlist : setWatchlist;
    const itemIndex = list.findIndex((item) => item.tick === tick);
    if (alertInputs[tick] && itemIndex !== -1) {
      const updatedList = [...list];
      updatedList[itemIndex].alertPrice = alertInputs[tick];
      setList(updatedList);
    }
  };

  const handleRemove = async (tick, isBrc20) => {
    const endpoint = isBrc20 ? 'brc20Watchlist' : 'watchlist';
    try {
      await axios.delete(`https://unidash-full.onrender.com/api/v1/${endpoint}/${tick}`);
      if (isBrc20) {
        setBrc20Watchlist(brc20Watchlist.filter(item => item.tick !== tick));
      } else {
        setWatchlist(watchlist.filter(item => item.tick !== tick));
      }
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="watchlist-table-container">
      {watchlist.some(item => item.alertPrice) && <AlertContainer watchlist={watchlist} />}
      <h2>Runes Watchlist</h2>
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
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.length > 0 ? (
            watchlist.map((item, index) => (
              <tr key={index}>
                <td>{item.tick}</td>
                <td>{item.curPrice}</td>
                <td>{item.changePrice}</td>
                <td>{item.btcVolume}</td>
                <td>{item.amountVolume}</td>
                <td>{item.holders}</td>
                <td>{item.symbol}</td>
                <td>
                  <div className="alert-container">
                    <input
                      type="number"
                      value={alertInputs[item.tick] || ''}
                      onChange={(e) => handleAlertInputChange(item.tick, e.target.value)}
                      className="alert-input"
                    />
                    <button onClick={() => handleAlertPriceSelect(item.tick, false)} className="alert-button">Set</button>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleRemove(item.tick, false)} className="remove-button">-</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No items in the watchlist</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>BRC20 Watchlist</h2>
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Tick</th>
            <th>Current Price</th>
            <th>Change Price</th>
            <th>BTC Volume</th>
            <th>Amount Volume</th>
            <th>Holders</th>
            <th>Transactions</th>
            <th>Alert Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {brc20Watchlist.length > 0 ? (
            brc20Watchlist.map((item, index) => (
              <tr key={index}>
                <td>{item.tick}</td>
                <td>{item.curPrice}</td>
                <td>{item.changePrice}</td>
                <td>{item.btcVolume}</td>
                <td>{item.amountVolume}</td>
                <td>{item.holders}</td>
                <td>{item.transactions}</td>
                <td>
                  <div className="alert-container">
                    <input
                      type="number"
                      value={alertInputs[item.tick] || ''}
                      onChange={(e) => handleAlertInputChange(item.tick, e.target.value)}
                      className="alert-input"
                    />
                    <button onClick={() => handleAlertPriceSelect(item.tick, true)} className="alert-button">Set</button>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleRemove(item.tick, true)} className="remove-button">-</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No items in the watchlist</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
