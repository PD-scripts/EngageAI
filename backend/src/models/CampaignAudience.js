const mongoose = require('mongoose');

const campaignAudienceSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  audienceName: { type: String, required: true },
  customerIds: [{ type: String }],
  audienceSize: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Map MongoDB _id to virtual id for frontend API contract compatibility
campaignAudienceSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

campaignAudienceSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('CampaignAudience', campaignAudienceSchema);
