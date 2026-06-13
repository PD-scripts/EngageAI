const Customer = require('../../models/Customer');
const healthScoreService = require('../health/healthScoreService');

/**
 * Ingests a customer into the database.
 * If a duplicate exists (by email or phone), updates the customer details.
 * Otherwise, creates a new customer.
 * 
 * @param {object} customerData - The customer payload
 * @returns {Promise<object>} { customer, isUpdate }
 */
async function ingestCustomer(customerData) {
  const { customerId, name, email, phone, city, dob } = customerData;
  
  if (!name) {
    throw new Error("Missing required field: 'name'");
  }
  
  if (!email && !phone) {
    throw new Error("Customer ingestion requires at least an 'email' or a 'phone' number.");
  }

  // 1. Duplicate detection: Find customer by email or phone
  const searchConditions = [];
  if (email) searchConditions.push({ email });
  if (phone) searchConditions.push({ phone });

  let customer = null;
  if (searchConditions.length > 0) {
    customer = await Customer.findOne({ $or: searchConditions });
  }

  let isUpdate = false;

  if (customer) {
    // 2. Duplicate found: Update fields
    console.log(`[Ingestion Service] Duplicate found. Updating customer ID: ${customer.customerId}`);
    customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (city) customer.city = city;
    if (dob) customer.dateOfBirth = new Date(dob);
    
    await customer.save();
    isUpdate = true;
  } else {
    // 3. No duplicate: Create new customer
    console.log(`[Ingestion Service] No duplicate found. Creating new customer...`);
    const finalCustomerId = customerId || `CUST${Date.now()}`;
    
    customer = new Customer({
      customerId: finalCustomerId,
      name,
      email: email || '',
      phone: phone || '',
      city: city || 'Unknown',
      dateOfBirth: dob ? new Date(dob) : null,
      totalSpend: 0,
      totalOrders: 0,
      lastPurchaseDays: 90, // start with default inactive window
      customerType: 'Regular',
      healthScore: 75, // default average health score
      source: 'ingestion'
    });
    
    await customer.save();
  }

  // 4. Initialize or update Health Score
  try {
    await healthScoreService.updateCustomerHealthScore(customer.customerId);
  } catch (err) {
    console.warn(`[Ingestion Service] Health score recalculation failed for ${customer.customerId}:`, err.message);
  }

  // Fetch final document after score update
  const finalDoc = await Customer.findOne({ customerId: customer.customerId });

  return {
    customer: finalDoc,
    isUpdate
  };
}

module.exports = {
  ingestCustomer
};
