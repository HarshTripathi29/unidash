const mongoose = require('mongoose');

const Brc20WatchlistSchema = new mongoose.Schema({
    tick: { type: String, required: true, unique: true },
    curPrice: { type: Number, required: true },
    changePrice: { type: Number, required: true },
    btcVolume: { type: Number, required: true },
    amountVolume: { type: Number, required: true },
    holders: { type: Number, required: true },
    transactions: { type: Number, required: true },
    alertPrice: { type: Number, default: null }
  });
  
  module.exports = mongoose.model('Brc20Watchlist', Brc20WatchlistSchema);