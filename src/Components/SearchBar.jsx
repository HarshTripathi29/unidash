import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ data, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const filteredData = data
      .filter((item) => item.tick.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    onSearch(filteredData);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by tick name..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
  );
};

export default SearchBar;
