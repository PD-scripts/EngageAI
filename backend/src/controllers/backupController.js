const backupService = require('../services/backup/backupService');
const path = require('path');

/**
 * GET /api/backups/customers
 * Exports live MongoDB customers to Excel and triggers binary download.
 */
async function exportCustomers(req, res) {
  try {
    const filePath = await backupService.createCustomerBackup();
    const fileName = path.basename(filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('[Backup Controller] Error downloading customer backup:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download customer backup' });
        }
      }
    });
  } catch (error) {
    console.error('[Backup Controller] Customer export failed:', error.message);
    res.status(500).json({ error: 'Failed to generate customer backup' });
  }
}

/**
 * GET /api/backups/orders
 * Exports live MongoDB orders to Excel and triggers binary download.
 */
async function exportOrders(req, res) {
  try {
    const filePath = await backupService.createOrderBackup();
    const fileName = path.basename(filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('[Backup Controller] Error downloading order backup:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download order backup' });
        }
      }
    });
  } catch (error) {
    console.error('[Backup Controller] Order export failed:', error.message);
    res.status(500).json({ error: 'Failed to generate order backup' });
  }
}

module.exports = {
  exportCustomers,
  exportOrders
};
