const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const Campaign = require('../../models/Campaign');

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];
const BEVERAGES = [
  'Hazelnut Cappuccino',
  'Iced Americano',
  'Cold Brew Espresso',
  'Vanilla Latte',
  'Caramel Macchiato',
  'Classic Espresso'
];

const FIRST_NAMES = [
  'Rahul', 'Ankit', 'Amit', 'Rohan', 'Vikram', 'Sanjay', 'Arjun', 'Rajiv', 'Pranav', 'Nikhil', 'Kunal', 'Dev', 'Rohit', 'Gaurav', 'Varun',
  'Priya', 'Neha', 'Pooja', 'Sneha', 'Ritu', 'Anjali', 'Tanvi', 'Shreya', 'Divya', 'Meera', 'Aditi', 'Kavita', 'Kiran', 'Sunita', 'Shalini'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Rao', 'Patel', 'Joshi', 'Reddy', 'Sen', 'Das', 'Nair', 'Kumar', 'Singh', 'Iyer', 'Patil'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate dynamic phone number
function generatePhone(idx) {
  const suffix = String(idx).padStart(3, '0');
  const mid = getRandomInt(8000, 9999);
  return `+91 9${mid}5${suffix}`;
}

// Generate birthdays (make some fall in the current week dynamically)
function generateDateOfBirth(idx) {
  const birthYear = 1975 + (idx % 30);
  const today = new Date();
  
  // 15 customers will have birthdays this week
  if (idx % 33 === 0) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + (idx % 7));
    return new Date(birthYear, targetDate.getMonth(), targetDate.getDate());
  } else {
    const birthMonth = idx % 12;
    const birthDay = 1 + (idx % 28);
    return new Date(birthYear, birthMonth, birthDay);
  }
}

// Pre-packaged campaigns matching example metrics
const seededCampaigns = [
  {
    title: 'Birthday Rewards Campaign',
    campaignName: 'Birthday Rewards Campaign',
    audienceName: 'All Customers',
    channel: 'WhatsApp',
    goal: 'Send birthday discount voucher',
    message: 'Happy birthday! Enjoy 20% off hazelnut cappuccino today!',
    status: 'Sent',
    sent: 450,
    delivered: 440,
    failed: 10,
    opened: 380,
    clicked: 210,
    purchases: 88,
    revenueGenerated: 36500,
    campaignCost: 8700,
    openRate: (380 / 440) * 100,
    clickRate: (210 / 380) * 100,
    conversionRate: (88 / 210) * 100,
    roi: 36500 / 8700,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Delhi Heatwave Promotion',
    campaignName: 'Delhi Heatwave Promotion',
    audienceName: 'Delhi Customers',
    channel: 'SMS',
    goal: 'Promote Cold Brew during heatwave',
    message: 'It is hot in Delhi! Cool down with a Cold Brew at 15% off!',
    status: 'Sent',
    sent: 1200,
    delivered: 1150,
    failed: 50,
    opened: 800,
    clicked: 320,
    purchases: 95,
    revenueGenerated: 41200,
    campaignCost: 11000,
    openRate: (800 / 1150) * 100,
    clickRate: (320 / 800) * 100,
    conversionRate: (95 / 320) * 100,
    roi: 41200 / 11000,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'VIP Win-Back Campaign',
    campaignName: 'VIP Win-Back Campaign',
    audienceName: 'High Value Customers',
    channel: 'Email',
    goal: 'Re-engage inactive VIP customers',
    message: 'We miss you! Here is a free espresso on your next visit.',
    status: 'Sent',
    sent: 350,
    delivered: 345,
    failed: 5,
    opened: 280,
    clicked: 150,
    purchases: 45,
    revenueGenerated: 22800,
    campaignCost: 6000,
    openRate: (280 / 345) * 100,
    clickRate: (150 / 280) * 100,
    conversionRate: (45 / 150) * 100,
    roi: 22800 / 6000,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Monsoon Latte Art Special',
    campaignName: 'Monsoon Latte Art Special',
    audienceName: 'Frequent Buyers',
    channel: 'Social',
    goal: 'Promote hot lattes on rainy days',
    message: 'Enjoy the monsoon rain with our signature hot vanilla latte art.',
    status: 'Sent',
    sent: 950,
    delivered: 920,
    failed: 30,
    opened: 620,
    clicked: 240,
    purchases: 58,
    revenueGenerated: 18500,
    campaignCost: 5500,
    openRate: (620 / 920) * 100,
    clickRate: (240 / 620) * 100,
    conversionRate: (58 / 240) * 100,
    roi: 18500 / 5500,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Weekend Espresso Flash Sale',
    campaignName: 'Weekend Espresso Flash Sale',
    audienceName: 'All Customers',
    channel: 'WhatsApp',
    goal: 'Drive high-volume weekend visits',
    message: 'Buy one get one free on all classic espresso shots this weekend!',
    status: 'Sent',
    sent: 2500,
    delivered: 2450,
    failed: 50,
    opened: 1980,
    clicked: 890,
    purchases: 140,
    revenueGenerated: 45000,
    campaignCost: 15000,
    openRate: (1980 / 2450) * 100,
    clickRate: (890 / 1980) * 100,
    conversionRate: (140 / 890) * 100,
    roi: 45000 / 15000,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Summer Cold Brew Promo (North India)',
    campaignName: 'Summer Cold Brew Promo (North India)',
    audienceName: 'All Customers',
    channel: 'WhatsApp',
    goal: 'Promote cold beverages in Delhi/NCR',
    message: 'Beat the North India heat with our signature vanilla cold brew!',
    status: 'Sent',
    sent: 1500,
    delivered: 1470,
    failed: 30,
    opened: 1210,
    clicked: 580,
    purchases: 92,
    revenueGenerated: 29800,
    campaignCost: 9500,
    openRate: (1210 / 1470) * 100,
    clickRate: (580 / 1210) * 100,
    conversionRate: (92 / 580) * 100,
    roi: 29800 / 9500,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

async function seed500() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected successfully.');

  // Clean current database collection
  console.log('Cleaning existing Customer, Order, and Campaign collections...');
  await Customer.deleteMany({});
  await Order.deleteMany({});
  await Campaign.deleteMany({});
  console.log('Database cleaned.');

  console.log('Generating 500 customers and order histories...');
  const customers = [];
  const orders = [];
  let orderCounter = 1;

  for (let i = 1; i <= 500; i++) {
    const customerId = `CUST${String(i).padStart(3, '0')}`;
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@engageai.co`;
    const phone = generatePhone(i);
    const city = getRandomElement(CITIES);
    const dateOfBirth = generateDateOfBirth(i);

    // Generate orders for customer (between 1 and 12 orders, but more for VIP/High Value to exceed 10000 Spend)
    const isHighValue = (i % 10 === 0); // 10% of customers are High Value
    const orderCount = isHighValue ? getRandomInt(28, 38) : getRandomInt(1, 12);
    const customerOrders = [];
    let totalSpend = 0;
    const productCounts = {};

    // Generate orders
    for (let o = 1; o <= orderCount; o++) {
      const orderId = `ORD${String(orderCounter++).padStart(5, '0')}`;
      const productName = getRandomElement(BEVERAGES);
      const amount = isHighValue ? getRandomInt(380, 620) : getRandomInt(140, 480);
      
      // Distribute dates in last 120 days
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - getRandomInt(0, 120));

      const status = getRandomInt(0, 10) === 0 ? 'Cancelled' : 'Completed';

      const orderDoc = {
        orderId,
        customerId,
        productName,
        amount,
        status,
        orderDate
      };

      orders.push(orderDoc);
      customerOrders.push(orderDoc);

      if (status === 'Completed') {
        totalSpend += amount;
        productCounts[productName] = (productCounts[productName] || 0) + 1;
      }
    }

    // Determine favorite product
    let favoriteProduct = 'Hazelnut Cappuccino';
    let maxCount = 0;
    for (const [prod, count] of Object.entries(productCounts)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteProduct = prod;
      }
    }

    // Determine customer type (VIP if spent > 2800)
    const customerType = totalSpend > 2800 ? 'VIP' : 'Regular';

    // Last purchase details
    let lastPurchaseDate = new Date();
    let lastPurchaseDays = 0;
    if (customerOrders.length > 0) {
      // Find most recent order
      const sorted = [...customerOrders].sort((a, b) => b.orderDate - a.orderDate);
      lastPurchaseDate = sorted[0].orderDate;
      const diffTime = Math.abs(new Date() - lastPurchaseDate);
      lastPurchaseDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Generate realistic health score
    let healthScore = 75; // average
    if (lastPurchaseDays > 60) {
      // Customer churning
      healthScore = getRandomInt(20, 45);
    } else if (totalSpend > 3500) {
      // Active spender
      healthScore = getRandomInt(88, 98);
    } else {
      healthScore = getRandomInt(50, 85);
    }

    const customerDoc = {
      customerId,
      name,
      email,
      phone,
      city,
      dateOfBirth,
      totalSpend,
      totalOrders: customerOrders.filter(o => o.status === 'Completed').length,
      lastPurchaseDate,
      lastPurchaseDays,
      customerType,
      favoriteProduct,
      healthScore
    };

    customers.push(customerDoc);
  }

  // Bulk insert to speed up the process
  console.log('Saving generated customers to MongoDB...');
  await Customer.insertMany(customers);
  console.log(`Saved ${customers.length} customers.`);

  console.log('Saving generated orders to MongoDB...');
  await Order.insertMany(orders);
  console.log(`Saved ${orders.length} orders.`);

  console.log('Saving seeded campaigns with analytics metrics to MongoDB...');
  await Campaign.insertMany(seededCampaigns);
  console.log(`Saved ${seededCampaigns.length} campaigns.`);

  console.log('Database seeding complete!');
  mongoose.connection.close();
}

seed500().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
