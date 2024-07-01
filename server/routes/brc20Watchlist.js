const express = require('express');
const router = express.Router();
const Brc20Watchlist = require('../models/Brc20Watchlist');

// Get all BRC20 watchlist items
router.get('/', async (req, res) => {
  try {
    const watchlist = await Brc20Watchlist.find();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item to the BRC20 watchlist
router.post('/', async (req, res) => {
  const watchlistItem = new Brc20Watchlist({
    tick: req.body.tick,
    curPrice: req.body.curPrice,
    changePrice: req.body.changePrice,
    btcVolume: req.body.btcVolume,
    amountVolume: req.body.amountVolume,
    holders: req.body.holders,
    transactions: req.body.transactions,
    alertPrice: req.body.alertPrice
  });

  try {
    const newWatchlistItem = await watchlistItem.save();
    res.status(201).json(newWatchlistItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item from the BRC20 watchlist
router.delete('/:tick', async (req, res) => {
  try {
    const watchlistItem = await Brc20Watchlist.findOneAndDelete({ tick: req.params.tick });
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    res.json({ message: 'Watchlist item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
