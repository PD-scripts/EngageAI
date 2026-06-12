const axios = require('axios');

// Helper to generate a random delay in ms
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to post status updates back to CRM Receipts endpoint
async function sendReceipt(communicationId, status) {
  try {
    const receiptsUrl = process.env.CRM_RECEIPTS_URL || 'http://localhost:5000/api/receipts';
    await axios.post(receiptsUrl, {
      communicationId,
      status
    });
    console.log(`[Channel Service callback] Dispatched receipt: ID ${communicationId} -> ${status}`);
  } catch (error) {
    console.error(`[Channel Service callback] Error dispatching receipt for ID ${communicationId}:`, error.message);
  }
}

/**
 * POST /channel/send
 * Triggers simulated message processing. Responds immediately, runs simulation asynchronously.
 */
function sendCommunication(req, res) {
  try {
    const { communicationId, campaignId, customerId, channel, message } = req.body;

    if (!communicationId) {
      return res.status(400).json({ error: "Missing required 'communicationId'" });
    }

    console.log(`[Channel Service] Received message request for ID: ${communicationId} via [${channel}]`);

    // 1. Acknowledge receipt immediately to decouple CRM send thread
    res.json({ success: true });

    // 2. Asynchronously simulate communication delivery timelines
    // Delay 1: Delivery status (DELIVERED vs FAILED)
    setTimeout(async () => {
      const isDelivered = Math.random() < 0.90; // 90% Delivery Rate
      const deliveryStatus = isDelivered ? 'DELIVERED' : 'FAILED';
      
      await sendReceipt(communicationId, deliveryStatus);

      if (!isDelivered) return; // End simulation if delivery failed

      // Delay 2: User opens message (70% probability of Delivered messages)
      setTimeout(async () => {
        const isOpened = Math.random() < 0.70;
        if (!isOpened) return;

        await sendReceipt(communicationId, 'OPENED');

        // Delay 3: User clicks CTA link (40% probability of Opened messages)
        setTimeout(async () => {
          const isClicked = Math.random() < 0.40;
          if (!isClicked) return;

          await sendReceipt(communicationId, 'CLICKED');

          // Delay 4: User completes checkout/purchase (15% probability of Clicked messages)
          setTimeout(async () => {
            const isPurchased = Math.random() < 0.15;
            if (!isPurchased) return;

            await sendReceipt(communicationId, 'PURCHASED');
          }, getRandomDelay(2000, 5000));

        }, getRandomDelay(2000, 5000));

      }, getRandomDelay(2000, 5000));

    }, getRandomDelay(1000, 3000));

  } catch (error) {
    console.error('[Channel Service] Error handling send trigger:', error);
    // Express safety catch
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Channel Error" });
    }
  }
}

module.exports = {
  sendCommunication
};
