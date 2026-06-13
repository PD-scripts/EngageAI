const mongoose = require('mongoose');

const CampaignDraftSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true
  },
  campaignType: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  expectedRevenue: {
    type: Number,
    required: true
  },
  recommendationSource: {
    type: String,
    required: true
  },
  generatedBy: {
    type: String,
    default: 'AI_STRATEGIST'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CampaignDraft', CampaignDraftSchema);
