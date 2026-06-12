const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const legacyMapper = require('../../utils/legacyMapper');

const BACKUPS_DIR = path.resolve(__dirname, '../../../backups');

/**
 * Ensures the backup directory exists.
 */
function ensureBackupsDir() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

/**
 * Formats the current date to YYYY_MM_DD.
 */
function getBackupDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}_${mm}_${dd}`;
}

/**
 * Exports all customer records from MongoDB into an Excel file.
 * Returns the absolute file path of the backup file.
 * 
 * @returns {Promise<string>}
 */
async function createCustomerBackup() {
  ensureBackupsDir();

  const customers = await Customer.find().lean();
  const legacyCustomers = customers.map(legacyMapper.mapToLegacyCustomer);

  const worksheet = XLSX.utils.json_to_sheet(legacyCustomers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  const fileName = `customers_${getBackupDateString()}.xlsx`;
  const filePath = path.join(BACKUPS_DIR, fileName);

  XLSX.writeFile(workbook, filePath);
  return filePath;
}

/**
 * Exports all order records from MongoDB into an Excel file.
 * Returns the absolute file path of the backup file.
 * 
 * @returns {Promise<string>}
 */
async function createOrderBackup() {
  ensureBackupsDir();

  const orders = await Order.find().lean();
  const legacyOrders = orders.map(legacyMapper.mapToLegacyOrder);

  const worksheet = XLSX.utils.json_to_sheet(legacyOrders);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  const fileName = `orders_${getBackupDateString()}.xlsx`;
  const filePath = path.join(BACKUPS_DIR, fileName);

  XLSX.writeFile(workbook, filePath);
  return filePath;
}

module.exports = {
  createCustomerBackup,
  createOrderBackup
};
