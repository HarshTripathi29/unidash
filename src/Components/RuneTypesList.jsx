import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchRunesTypes } from '../runes';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from './SearchBar';
import MagicEdenTable from './MagicEdenTable';
import './runeTypesList.css';
import Brc20List from './Brc20List';

const RuneTypesList = () => {
 
  const [runeTypes, setRuneTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState('unisat');
  const tableRefs = useRef({});

  useEffect(() => {
    const getRuneTypes = async () => {
      try {
        const data = await fetchRunesTypes();
        setRuneTypes(data);
        setFilteredData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getRuneTypes();
  }, []);

  const handleSearch = (filteredData) => {
    setSearchResults(filteredData);
    setFilteredData(filteredData.length > 0 ? filteredData : runeTypes);
  };

  const handleReset = () => {
    setSearchResults([]);
    setFilteredData(runeTypes);
  };

  const scrollToTick = (tick) => {
    const element = tableRefs.current[tick];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCheckboxChange = (runeType) => async (event) => {
    if (event.target.checked) {
      try {
        const response = await axios.post('https://unidash-full.onrender.com/api/v1/watchlist', runeType);
        console.log('Post response:', response.data);
      } catch (error) {
        console.error('Error adding to watchlist:', error.response ? error.response.data : error.message);
      }
    } else {
      try {
        const response = await axios.delete(`https://unidash-full.onrender.com/api/v1/watchlist/${runeType.tick}`);
        console.log('Delete response:', response.data);
      } catch (error) {
        console.error('Error removing from watchlist:', error.response ? error.response.data : error.message);
      }
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="table-container">
      <h1>Rune Types</h1>
      <div className='toggle-wrapper'>
        <div className="table-toggle">
          <button 
            onClick={() => setSelectedTable('unisat')} 
            className={selectedTable === 'unisat' ? 'active' : ''}>UniSat
          </button>
          <button 
            onClick={() => setSelectedTable('magiceden')} 
            className={selectedTable === 'magiceden' ? 'active' : ''}>MagicEden
          </button>
          <button 
            onClick={() => setSelectedTable('brc20')} 
            className={selectedTable === 'brc20' ? 'active' : ''}>BRC20
          </button>
        </div>
        <div>
          <Link to="/watchlist" className='watchlist-link'>Go to Watchlist</Link>
        </div>
      </div>

      <SearchBar data={runeTypes} onSearch={handleSearch} />
      
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((runeType, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => scrollToTick(runeType.tick)}
            >
              {runeType.tick}
            </div>
          ))}
          <button onClick={handleReset} className="reset-button">Reset Table</button>
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        selectedTable === 'unisat' ? (
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
              {filteredData.length > 0 ? (
                filteredData.map((runeType, index) => (
                  <tr key={index} ref={(el) => (tableRefs.current[runeType.tick] = el)}>
                    <td className='tick'>{runeType.tick}</td>
                    <td>{runeType.curPrice}</td>
                    <td>{runeType.changePrice}</td>
                    <td>{runeType.btcVolume}</td>
                    <td>{runeType.amountVolume}</td>
                    <td>{runeType.holders}</td>
                    <td>{runeType.symbol} </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={handleCheckboxChange(runeType)}
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
        ) : selectedTable === 'magiceden' ? (
          <MagicEdenTable />
        ) : (
      <div>
        <Brc20List/>
      </div>
        )
      )}
    </div>
  );
};

export default RuneTypesList;
