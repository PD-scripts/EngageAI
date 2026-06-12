const express = require('express');
const cors = require('cors');
require('dotenv').config();

const channelRoutes = require('./routes/channelRoutes');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

// Mount messaging channels route
app.use('/channel', channelRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Channel Service running on port " + PORT });
});

app.listen(PORT, () => {
  console.log(`[Channel Service] Started successfully. Running on http://localhost:${PORT}`);
});
