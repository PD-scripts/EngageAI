const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outputPath = path.resolve(__dirname, '../data/Xeno_CRM_Dummy_Data.xlsx');

// Ensure parent data directory exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Lists for mock data generation
const firstNames = ['Aarav', 'Ananya', 'Vivaan', 'Diya', 'Kabir', 'Ira', 'Sai', 'Riya', 'Arjun', 'Meera', 'Rohan', 'Neha', 'Aditya', 'Siddharth', 'Tanvi', 'Ishaan', 'Kavya', 'Rahul', 'Pooja', 'Vikram'];
const lastNames = ['Sharma', 'Patel', 'Mehta', 'Iyer', 'Singh', 'Joshi', 'Reddy', 'Sen', 'Gupta', 'Nair', 'Das', 'Roy', 'Choudhury', 'Verma', 'Bose', 'Rao', 'Pillai', 'Kumar', 'Malhotra', 'Mishra'];
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];
const products = ['Wireless Earbuds', 'Running Sneakers', 'Leather Jacket', 'Denim Jeans', 'Smart Watch', 'Coffee Maker', 'Premium Laptop', 'Backpack', 'Ergonomic Mouse', 'Mechanical Keyboard', 'Gym Duffle Bag', 'Designer Sunglasses', 'Desk Lamp', 'Noise Cancelling Headphones', 'Charging Dock'];
const statuses = ['Completed', 'Shipped', 'Pending', 'Cancelled'];

// Helper to get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number in range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. Generate 200 initial customer structures
const customers = [];
for (let i = 1; i <= 200; i++) {
  const customerId = `C${1000 + i}`;
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
  const phone = `987654${String(3000 + i).padStart(4, '0')}`;
  const city = randomItem(cities);

  customers.push({
    CustomerID: customerId,
    Name: name,
    Email: email,
    Phone: phone,
    City: city,
    TotalSpend: 0,
    TotalOrders: 0,
    LastPurchaseDays: 0,
    CustomerType: 'New',
    IsFirstTimeBuyer: false
  });
}

// 2. Generate exactly 200 orders and assign them to customers
const orders = [];
for (let j = 1; j <= 200; j++) {
  const orderId = `O${5000 + j}`;
  
  // Pick a random customer from our list
  const customer = randomItem(customers);
  const product = randomItem(products);
  const amount = randomRange(500, 15000);
  
  // Pick status (Completed is most common)
  let status = 'Completed';
  const randStatus = Math.random();
  if (randStatus < 0.1) status = 'Pending';
  else if (randStatus < 0.2) status = 'Shipped';
  else if (randStatus < 0.25) status = 'Cancelled';

  // Generate date in last 180 days
  const dateOffset = randomRange(1, 180);
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() - dateOffset);
  const dateString = orderDate.toISOString().split('T')[0];

  orders.push({
    OrderID: orderId,
    CustomerID: customer.CustomerID,
    ProductName: product,
    Amount: amount,
    Status: status,
    OrderDate: dateString
  });

  // Update customer spend and order count
  if (status !== 'Cancelled') {
    customer.TotalSpend += amount;
    customer.TotalOrders += 1;
    
    // Set LastPurchaseDays to the most recent purchase offset
    if (customer.LastPurchaseDays === 0 || dateOffset < customer.LastPurchaseDays) {
      customer.LastPurchaseDays = dateOffset;
    }
  }
}

// 3. Finalize customer metrics based on orders count
customers.forEach(customer => {
  if (customer.TotalOrders === 0) {
    customer.CustomerType = 'Inactive';
    customer.IsFirstTimeBuyer = false;
    customer.LastPurchaseDays = randomRange(120, 240); // default fallback
  } else if (customer.TotalOrders === 1) {
    customer.CustomerType = 'New';
    customer.IsFirstTimeBuyer = true;
  } else if (customer.TotalOrders < 5) {
    customer.CustomerType = 'Regular';
    customer.IsFirstTimeBuyer = false;
  } else {
    customer.CustomerType = 'VIP';
    customer.IsFirstTimeBuyer = false;
  }
});

// Create workbook
const wb = XLSX.utils.book_new();

// Create sheets
const wsCustomers = XLSX.utils.json_to_sheet(customers);
const wsOrders = XLSX.utils.json_to_sheet(orders);

// Append sheets to workbook
XLSX.utils.book_append_sheet(wb, wsCustomers, "Customers");
XLSX.utils.book_append_sheet(wb, wsOrders, "Orders");

// Write file
XLSX.writeFile(wb, outputPath);

console.log(`Successfully generated exactly 200 customers and 200 orders in: ${outputPath}`);
