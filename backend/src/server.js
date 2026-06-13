const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: true });

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Load in-memory database parser
const excelParser = require('./services/excelParser');

const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const queryRoutes = require('./routes/queryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const strategistRoutes = require('./routes/strategistRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const backupRoutes = require('./routes/backupRoutes');
const customerIngestionRoutes = require('./routes/customerIngestionRoutes');
const ingestionScheduler = require('./services/customerIngestion/ingestionScheduler');
const aiStrategistRoutes = require('./routes/aiStrategistRoutes');
const channelRoutes = require('../channel-service/src/routes/channelRoutes');

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
app.use('/api/receipts', receiptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/strategist', strategistRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/backups', backupRoutes);
app.use('/api/ingestion', customerIngestionRoutes);
app.use('/api/ai-strategist', aiStrategistRoutes);
app.use('/channel', channelRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start background customer ingestion scheduler
  ingestionScheduler.start();
});

