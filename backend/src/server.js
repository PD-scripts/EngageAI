const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: true });

// Load in-memory database parser
const excelParser = require('./services/excelParser');

const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const queryRoutes = require('./routes/queryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Xeno CRM Backend Running" });
});

// Mount modular routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/campaigns', campaignRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

