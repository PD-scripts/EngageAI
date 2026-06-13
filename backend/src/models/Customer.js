const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  city: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  totalSpend: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: {
    type: Date
  },
  lastPurchaseDays: {
    type: Number,
    default: 0
  },
  customerType: {
    type: String,
    default: 'Regular'
  },
  favoriteProduct: {
    type: String
  },
  healthScore: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    default: 'import'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
