const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const watchlistRoutes = require('./routes/Watchlist');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/tokens');
const path = require('path');
const brc20WatchlistRouter = require('./routes/brc20Watchlist');


const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = NODE_ENV === 'production' ? 'https://unidash-full.onrender.com' : 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 5000;
const mongoURI = 'mongodb+srv://harshtripathi042:harsh123@cluster0.etqbz6r.mongodb.net/unidash';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/brc20Watchlist', brc20WatchlistRouter);

//------deployment--------

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully');
  });
}
//------------


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
