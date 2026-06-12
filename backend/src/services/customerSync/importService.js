const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Parses and returns date values from Excel.
 */
function parseExcelDate(val, index) {
  if (!val) {
    // Seeding fallback: distribute birthdays so some fall in the next 7 days
    const birthYear = 1970 + (index % 35);
    const today = new Date();
    let birthMonth, birthDay;
    if (index % 15 === 0) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + (index % 7));
      birthMonth = targetDate.getMonth();
      birthDay = targetDate.getDate();
    } else {
      birthMonth = index % 12;
      birthDay = 1 + (index % 28);
    }
    return new Date(birthYear, birthMonth, birthDay);
  }

  if (val instanceof Date) return val;

  // Excel serial date formatting
  if (typeof val === 'number') {
    return new Date((val - (25567 + 2)) * 86400 * 1000);
  }

  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Imports customers from an Excel workbook path.
 * Supports updating existing customers by CustomerID.
 * 
 * @param {string} filePath - Absolute path to Excel workbook
 * @returns {Promise<{customersAdded: number, customersUpdated: number, duplicatesIgnored: number, invalidRows: number}>}
 */
async function importCustomersFromExcel(filePath) {
  let customersAdded = 0;
  let customersUpdated = 0;
  let duplicatesIgnored = 0;
  let invalidRows = 0;

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Customers'];
  if (!worksheet) {
    throw new Error('Customers sheet not found in workbook');
  }

  const rows = XLSX.utils.sheet_to_json(worksheet);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawId = row.CustomerID || row.customerId;
    const rawName = row.Name || row.name;
    const rawEmail = row.Email || row.email;

    if (!rawId || !rawName || !rawEmail) {
      invalidRows++;
      continue;
    }

    const customerId = String(rawId).trim();
    const name = String(rawName).trim();
    const email = String(rawEmail).trim();
    const phone = String(row.Phone || row.phone || '').trim();
    const city = String(row.City || row.city || '').trim();
    const dateOfBirth = parseExcelDate(row.DateOfBirth || row.dateOfBirth, i);

    const totalSpend = Number(row.TotalSpend || row.totalSpend || 0);
    const totalOrders = Number(row.TotalOrders || row.totalOrders || 0);
    const lastPurchaseDays = Number(row.LastPurchaseDays || row.lastPurchaseDays || 0);
    const customerType = String(row.CustomerType || row.customerType || 'Regular').trim();
    const favoriteProduct = String(row.favoriteProduct || row.FavoriteProduct || '').trim();

    // Check if customer exists in MongoDB
    const existing = await Customer.findOne({ customerId });

    if (existing) {
      // Check if identical to see if it qualifies as ignored duplicate
      const isIdentical = 
        existing.name === name &&
        existing.email === email &&
        existing.phone === phone &&
        existing.city === city &&
        existing.totalSpend === totalSpend &&
        existing.totalOrders === totalOrders;

      if (isIdentical) {
        duplicatesIgnored++;
      } else {
        existing.name = name;
        existing.email = email;
        existing.phone = phone;
        existing.city = city;
        if (dateOfBirth) existing.dateOfBirth = dateOfBirth;
        existing.totalSpend = totalSpend;
        existing.totalOrders = totalOrders;
        existing.lastPurchaseDays = lastPurchaseDays;
        existing.customerType = customerType;
        if (favoriteProduct) existing.favoriteProduct = favoriteProduct;
        await existing.save();
        customersUpdated++;
      }
    } else {
      const newCustomer = new Customer({
        customerId,
        name,
        email,
        phone,
        city,
        dateOfBirth,
        totalSpend,
        totalOrders,
        lastPurchaseDays,
        customerType,
        favoriteProduct
      });
      await newCustomer.save();
      customersAdded++;
    }
  }

  return {
    customersAdded,
    customersUpdated,
    duplicatesIgnored,
    invalidRows
  };
}

/**
 * Imports orders from an Excel workbook path.
 * 
 * @param {string} filePath - Absolute path to Excel workbook
 */
async function importOrdersFromExcel(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Orders'];
  if (!worksheet) {
    throw new Error('Orders sheet not found in workbook');
  }

  const rows = XLSX.utils.sheet_to_json(worksheet);
  let ordersAdded = 0;
  let ordersUpdated = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawId = row.OrderID || row.orderId;
    const rawCustId = row.CustomerID || row.customerId;
    const rawProduct = row.ProductName || row.productName;

    if (!rawId || !rawCustId || !rawProduct) {
      continue;
    }

    const orderId = String(rawId).trim();
    const customerId = String(rawCustId).trim();
    const productName = String(rawProduct).trim();
    const amount = Number(row.Amount || row.amount || 0);
    const status = String(row.Status || row.status || 'Completed').trim();
    
    // Parse order date
    let orderDate = new Date();
    if (row.OrderDate || row.orderDate) {
      const parsed = new Date(row.OrderDate || row.orderDate);
      if (!isNaN(parsed.getTime())) {
        orderDate = parsed;
      }
    }

    const existing = await Order.findOne({ orderId });

    if (existing) {
      existing.customerId = customerId;
      existing.productName = productName;
      existing.amount = amount;
      existing.status = status;
      existing.orderDate = orderDate;
      await existing.save();
      ordersUpdated++;
    } else {
      const newOrder = new Order({
        orderId,
        customerId,
        productName,
        amount,
        status,
        orderDate
      });
      await newOrder.save();
      ordersAdded++;
    }
  }

  return {
    ordersAdded,
    ordersUpdated
  };
}

/**
 * Seed MongoDB with default Excel data if database is empty at server startup.
 */
async function syncDefaultExcelToMongoDB() {
  try {
    const customerCount = await Customer.countDocuments();
    const orderCount = await Order.countDocuments();

    if (customerCount === 0 || orderCount === 0) {
      console.log('[Import Service] Database is empty. Seeding MongoDB with default Excel data...');
      const defaultExcelPath = path.resolve(__dirname, '../../../data/Xeno_CRM_Dummy_Data.xlsx');
      
      if (fs.existsSync(defaultExcelPath)) {
        const custSummary = await importCustomersFromExcel(defaultExcelPath);
        const ordSummary = await importOrdersFromExcel(defaultExcelPath);
        console.log(`[Import Service] Seeded customers:`, custSummary);
        console.log(`[Import Service] Seeded orders:`, ordSummary);
      } else {
        console.warn(`[Import Service] Default Excel sheet not found at: ${defaultExcelPath}`);
      }
    } else {
      console.log(`[Import Service] Operational database loaded. Customers: ${customerCount}, Orders: ${orderCount}`);
    }
  } catch (error) {
    console.error('[Import Service] Error seeding MongoDB at startup:', error.message);
  }
}

module.exports = {
  importCustomersFromExcel,
  importOrdersFromExcel,
  syncDefaultExcelToMongoDB
};
