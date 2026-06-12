const fs = require('fs');
const path = require('path');
const excelParser = require('./excelParser');

const filePath = path.resolve(__dirname, '../data/communications.json');

/**
 * Loads all communications from communications.json.
 */
function loadCommunications() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('[Communication Service] Error loading JSON DB:', error);
    return [];
  }
}

/**
 * Saves all communications to communications.json.
 */
function saveCommunications(comms) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(comms, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('[Communication Service] Error writing JSON DB:', error);
    return false;
  }
}

/**
 * Adds a list of communications.
 */
function addCommunications(newComms) {
  const comms = loadCommunications();
  comms.push(...newComms);
  saveCommunications(comms);
}

/**
 * Updates a communication status and sets timestamps.
 */
function updateCommunicationStatus(communicationId, status) {
  const comms = loadCommunications();
  const index = comms.findIndex(c => c.id === communicationId);
  
  if (index === -1) {
    console.warn(`[Communication Service] Record for ID ${communicationId} not found.`);
    return null;
  }

  const record = comms[index];
  record.status = status;
  
  const timestamp = new Date().toISOString();
  record.updatedAt = timestamp;

  if (status === 'DELIVERED') record.deliveredAt = timestamp;
  if (status === 'FAILED') record.failedAt = timestamp;
  if (status === 'OPENED') {
    if (!record.deliveredAt) record.deliveredAt = timestamp;
    record.openedAt = timestamp;
  }
  if (status === 'CLICKED') {
    if (!record.deliveredAt) record.deliveredAt = timestamp;
    if (!record.openedAt) record.openedAt = timestamp;
    record.clickedAt = timestamp;
  }
  if (status === 'PURCHASED') {
    if (!record.deliveredAt) record.deliveredAt = timestamp;
    if (!record.openedAt) record.openedAt = timestamp;
    if (!record.clickedAt) record.clickedAt = timestamp;
    record.purchasedAt = timestamp;
  }

  comms[index] = record;
  saveCommunications(comms);
  return record;
}

/**
 * Calculates metrics for a specific campaign.
 */
function getCampaignStats(campaignId) {
  const comms = loadCommunications().filter(c => String(c.campaignId) === String(campaignId));
  
  const stats = {
    sent: comms.length,
    failed: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    purchased: 0
  };

  comms.forEach(c => {
    if (c.status === 'FAILED' || c.failedAt) stats.failed += 1;
    if (c.deliveredAt || ['DELIVERED', 'OPENED', 'CLICKED', 'PURCHASED'].includes(c.status)) stats.delivered += 1;
    if (c.openedAt || ['OPENED', 'CLICKED', 'PURCHASED'].includes(c.status)) stats.opened += 1;
    if (c.clickedAt || ['CLICKED', 'PURCHASED'].includes(c.status)) stats.clicked += 1;
    if (c.purchasedAt || c.status === 'PURCHASED') stats.purchased += 1;
  });

  return stats;
}

/**
 * Compiles a sorted timeline log of activity events for a specific campaign.
 */
function getCampaignActivityFeed(campaignId) {
  const comms = loadCommunications().filter(c => String(c.campaignId) === String(campaignId));
  const events = [];

  comms.forEach(c => {
    // Resolve shopper name from Excel
    const shopper = excelParser.getCustomerById(c.customerId);
    const shopperName = shopper ? shopper.Name : `Shopper #${c.customerId}`;

    // Push events for each timestamp that exists
    if (c.createdAt) {
      events.push({
        id: `${c.id}-sent`,
        text: `Campaign message was successfully SENT to ${shopperName} via ${c.channel}.`,
        timestamp: c.createdAt,
        type: 'SENT'
      });
    }
    if (c.failedAt) {
      events.push({
        id: `${c.id}-failed`,
        text: `Delivery FAILED for shopper ${shopperName}. Gateway rejected connection.`,
        timestamp: c.failedAt,
        type: 'FAILED'
      });
    }
    if (c.deliveredAt) {
      events.push({
        id: `${c.id}-delivered`,
        text: `Message DELIVERED to shopper ${shopperName}'s terminal.`,
        timestamp: c.deliveredAt,
        type: 'DELIVERED'
      });
    }
    if (c.openedAt) {
      events.push({
        id: `${c.id}-opened`,
        text: `Message OPENED by shopper ${shopperName}.`,
        timestamp: c.openedAt,
        type: 'OPENED'
      });
    }
    if (c.clickedAt) {
      events.push({
        id: `${c.id}-clicked`,
        text: `Shopper ${shopperName} CLICKED CTA product link.`,
        timestamp: c.clickedAt,
        type: 'CLICKED'
      });
    }
    if (c.purchasedAt) {
      events.push({
        id: `${c.id}-purchased`,
        text: `🎉 Shopper ${shopperName} completed PURCHASE checkout!`,
        timestamp: c.purchasedAt,
        type: 'PURCHASED'
      });
    }
  });

  // Sort by timestamp newest first
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = {
  loadCommunications,
  saveCommunications,
  addCommunications,
  updateCommunicationStatus,
  getCampaignStats,
  getCampaignActivityFeed
};
