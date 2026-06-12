const mongoose = require('mongoose');
require('dotenv').config({ override: true });

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('[Database Error] MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[Database] Connected to MongoDB via db.js module.');
    
    // Seed default data if MongoDB collections are empty
    const { syncDefaultExcelToMongoDB } = require('../services/customerSync/importService');
    syncDefaultExcelToMongoDB();
  } catch (error) {
    console.error('[Database Error] Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
