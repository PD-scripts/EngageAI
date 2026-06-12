const Campaign = require('../models/Campaign');
const Communication = require('../models/Communication');
const mongoose = require('mongoose');

/**
 * POST /api/receipts
 * Handles simulated messaging event webhook callbacks from the Channel Service.
 */
async function handleReceipt(req, res) {
  try {
    const { communicationId, status } = req.body;

    if (!communicationId || !status) {
      return res.status(400).json({ error: "Missing required 'communicationId' or 'status' in body." });
    }

    // 1. Find and update status and timestamps in MongoDB
    const commId = mongoose.Types.ObjectId.createFromHexString(communicationId);
    const comm = await Communication.findById(commId);

    if (!comm) {
      return res.status(404).json({ error: `Communication record ${communicationId} not found.` });
    }

    const timestamp = new Date();
    comm.status = status;

    if (status === 'DELIVERED') comm.deliveredAt = timestamp;
    if (status === 'FAILED') comm.failedAt = timestamp;
    if (status === 'OPENED') {
      if (!comm.deliveredAt) comm.deliveredAt = timestamp;
      comm.openedAt = timestamp;
    }
    if (status === 'CLICKED') {
      if (!comm.deliveredAt) comm.deliveredAt = timestamp;
      if (!comm.openedAt) comm.openedAt = timestamp;
      comm.clickedAt = timestamp;
    }
    if (status === 'PURCHASED') {
      if (!comm.deliveredAt) comm.deliveredAt = timestamp;
      if (!comm.openedAt) comm.openedAt = timestamp;
      if (!comm.clickedAt) comm.clickedAt = timestamp;
      comm.purchasedAt = timestamp;
    }

    await comm.save();

    // Trigger recalculation of the customer's health score based on the updated engagement
    const healthScoreService = require('../services/health/healthScoreService');
    await healthScoreService.updateCustomerHealthScore(comm.customerId);

    // 2. Aggregate stats for the corresponding Campaign and sync to MongoDB cache
    const campaignId = comm.campaignId;
    const sent = await Communication.countDocuments({ campaignId });
    const failed = await Communication.countDocuments({ campaignId, status: 'FAILED' });
    const delivered = await Communication.countDocuments({ campaignId, deliveredAt: { $ne: null } });
    const opened = await Communication.countDocuments({ campaignId, openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ campaignId, clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ campaignId, purchasedAt: { $ne: null } });

    // Sync database cache to keep dashboard lists clean
    await Campaign.findByIdAndUpdate(campaignId, {
      sent,
      delivered,
      failed,
      opened,
      clicked,
      purchased
    });

    res.json({
      success: true,
      message: `Status of ${communicationId} updated to ${status}`,
      record: comm
    });

  } catch (error) {
    console.error('[Receipt Controller] Error parsing webhook callback:', error);
    res.status(500).json({ error: "Internal Server Error updating transaction receipt" });
  }
}

module.exports = {
  handleReceipt
};

