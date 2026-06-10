const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  audienceName: { type: String, required: true },
  audienceSize: { type: Number, default: 0 },
  channel: { type: String, required: true },
  goal: { type: String, required: true },
  strategy: { type: String },
  recommendedOffer: { type: String },
  title: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  cta: { type: String },
  aiReasoning: { type: String },
  qualityScore: { type: Number, default: 75 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  status: { type: String, default: 'Draft' },
  
  // Future metrics placeholders
  sent: { type: Number, default: 0 },
  delivered: { type: Number, default: 0 },
  opened: { type: Number, default: 0 },
  clicked: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Map MongoDB _id to virtual id for frontend API contract compatibility
campaignSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized in JSON responses
campaignSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
