const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: String, required: true },
  channel: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['SENT', 'DELIVERED', 'FAILED', 'OPENED', 'CLICKED', 'PURCHASED'], 
    default: 'SENT' 
  },
  sentAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  failedAt: { type: Date },
  openedAt: { type: Date },
  clickedAt: { type: Date },
  purchasedAt: { type: Date }
}, {
  timestamps: true
});

// Map MongoDB _id to virtual id for frontend API contract compatibility
communicationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

communicationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Communication', communicationSchema);
