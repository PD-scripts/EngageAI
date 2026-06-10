const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'Xeno_CRM_Dummy_Data.xlsx');

// Dummy Customer Data matching exact schema:
// CustomerID, Name, Email, Phone, City, TotalSpend, TotalOrders, LastPurchaseDays, CustomerType
const customers = [
  { CustomerID: "C1001", Name: "Rahul Sharma", Email: "rahul.sharma@example.com", Phone: "9876543210", City: "Delhi", TotalSpend: 25000, TotalOrders: 5, LastPurchaseDays: 12, CustomerType: "VIP" },
  { CustomerID: "C1002", Name: "Priya Patel", Email: "priya.patel@example.com", Phone: "9876543211", City: "Mumbai", TotalSpend: 4200, TotalOrders: 2, LastPurchaseDays: 28, CustomerType: "Regular" },
  { CustomerID: "C1003", Name: "Amit Mehta", Email: "amit.mehta@example.com", Phone: "9876543212", City: "Bangalore", TotalSpend: 55000, TotalOrders: 10, LastPurchaseDays: 5, CustomerType: "VIP" },
  { CustomerID: "C1004", Name: "Diya Iyer", Email: "diya.iyer@example.com", Phone: "9876543213", City: "Chennai", TotalSpend: 899, TotalOrders: 1, LastPurchaseDays: 45, CustomerType: "New" },
  { CustomerID: "C1005", Name: "Kabir Singh", Email: "kabir.singh@example.com", Phone: "9876543214", City: "Kolkata", TotalSpend: 3100, TotalOrders: 2, LastPurchaseDays: 18, CustomerType: "Regular" },
  { CustomerID: "C1006", Name: "Ira Joshi", Email: "ira.joshi@example.com", Phone: "9876543215", City: "Pune", TotalSpend: 1250, TotalOrders: 1, LastPurchaseDays: 90, CustomerType: "Inactive" },
  { CustomerID: "C1007", Name: "Sai Reddy", Email: "sai.reddy@example.com", Phone: "9876543216", City: "Hyderabad", TotalSpend: 9990, TotalOrders: 4, LastPurchaseDays: 8, CustomerType: "Regular" },
  { CustomerID: "C1008", Name: "Riya Sen", Email: "riya.sen@example.com", Phone: "9876543217", City: "Kolkata", TotalSpend: 4500, TotalOrders: 3, LastPurchaseDays: 32, CustomerType: "Regular" },
  { CustomerID: "C1009", Name: "Arjun Gupta", Email: "arjun.gupta@example.com", Phone: "9876543218", City: "Mumbai", TotalSpend: 2300, TotalOrders: 1, LastPurchaseDays: 60, CustomerType: "Regular" },
  { CustomerID: "C1010", Name: "Meera Nair", Email: "meera.nair@example.com", Phone: "9876543219", City: "Delhi", TotalSpend: 1200, TotalOrders: 1, LastPurchaseDays: 110, CustomerType: "Inactive" },
  { CustomerID: "C1011", Name: "Anil Kumar", Email: "anil.kumar@example.com", Phone: "9876543220", City: "Hyderabad", TotalSpend: 18000, TotalOrders: 6, LastPurchaseDays: 14, CustomerType: "VIP" },
  { CustomerID: "C1012", Name: "Sanya Malhotra", Email: "sanya.m@example.com", Phone: "9876543221", City: "Pune", TotalSpend: 950, TotalOrders: 1, LastPurchaseDays: 3, CustomerType: "New" },
  { CustomerID: "C1013", Name: "Vikram Malhotra", Email: "vikram.m@example.com", Phone: "9876543222", City: "Delhi", TotalSpend: 15400, TotalOrders: 4, LastPurchaseDays: 20, CustomerType: "Regular" },
  { CustomerID: "C1014", Name: "Neha Gupta", Email: "neha.gupta@example.com", Phone: "9876543223", City: "Bangalore", TotalSpend: 32000, TotalOrders: 8, LastPurchaseDays: 7, CustomerType: "VIP" },
  { CustomerID: "C1015", Name: "Rohan Das", Email: "rohan.das@example.com", Phone: "9876543224", City: "Mumbai", TotalSpend: 1100, TotalOrders: 1, LastPurchaseDays: 140, CustomerType: "Inactive" }
];

// Dummy Order Data matching exact schema:
// OrderID, CustomerID, ProductName, Amount, Status, OrderDate
const orders = [
  { OrderID: "O5001", CustomerID: "C1001", ProductName: "Leather Jacket", Amount: 5000, Status: "Completed", OrderDate: "2026-05-20" },
  { OrderID: "O5002", CustomerID: "C1001", ProductName: "Running Sneakers", Amount: 4500, Status: "Completed", OrderDate: "2026-05-28" },
  { OrderID: "O5003", CustomerID: "C1001", ProductName: "Denim Jeans", Amount: 2500, Status: "Completed", OrderDate: "2026-05-29" },
  { OrderID: "O5004", CustomerID: "C1002", ProductName: "Smart Watch", Amount: 3100, Status: "Completed", OrderDate: "2026-05-12" },
  { OrderID: "O5005", CustomerID: "C1002", ProductName: "Wireless Earbuds", Amount: 1100, Status: "Completed", OrderDate: "2026-05-13" },
  { OrderID: "O5006", CustomerID: "C1003", ProductName: "Premium Laptop", Amount: 45000, Status: "Completed", OrderDate: "2026-06-05" },
  { OrderID: "O5007", CustomerID: "C1003", ProductName: "Laptop Bag", Amount: 10000, Status: "Completed", OrderDate: "2026-06-05" },
  { OrderID: "O5008", CustomerID: "C1004", ProductName: "Cotton T-Shirt", Amount: 899, Status: "Completed", OrderDate: "2026-04-26" },
  { OrderID: "O5009", CustomerID: "C1005", ProductName: "Coffee Maker", Amount: 1800, Status: "Completed", OrderDate: "2026-05-23" },
  { OrderID: "O5010", CustomerID: "C1005", ProductName: "Coffee Mug Set", Amount: 1300, Status: "Completed", OrderDate: "2026-05-23" },
  { OrderID: "O5011", CustomerID: "C1006", ProductName: "Gym Duffle Bag", Amount: 1250, Status: "Shipped", OrderDate: "2026-03-12" },
  { OrderID: "O5012", CustomerID: "C1007", ProductName: "Designer Sunglasses", Amount: 4990, Status: "Completed", OrderDate: "2026-06-02" },
  { OrderID: "O5013", CustomerID: "C1007", ProductName: "Casual Shoes", Amount: 5000, Status: "Completed", OrderDate: "2026-06-02" },
  { OrderID: "O5014", CustomerID: "C1008", ProductName: "Smart Thermostat", Amount: 3000, Status: "Completed", OrderDate: "2026-05-09" },
  { OrderID: "O5015", CustomerID: "C1008", ProductName: "USB-C Adapter", Amount: 1500, Status: "Completed", OrderDate: "2026-05-09" },
  { OrderID: "O5016", CustomerID: "C1009", ProductName: "Electric Kettle", Amount: 2300, Status: "Shipped", OrderDate: "2026-04-11" },
  { OrderID: "O5017", CustomerID: "C1010", ProductName: "Desk Lamp", Amount: 1200, Status: "Pending", OrderDate: "2026-02-20" },
  { OrderID: "O5018", CustomerID: "C1011", ProductName: "Noise Cancelling Headphones", Amount: 12000, Status: "Completed", OrderDate: "2026-05-27" },
  { OrderID: "O5019", CustomerID: "C1011", ProductName: "Phone Stand", Amount: 1500, Status: "Completed", OrderDate: "2026-05-27" },
  { OrderID: "O5020", CustomerID: "C1011", ProductName: "Charging Dock", Amount: 4500, Status: "Completed", OrderDate: "2026-05-27" },
  { OrderID: "O5021", CustomerID: "C1012", ProductName: "Backpack", Amount: 950, Status: "Completed", OrderDate: "2026-06-07" },
  { OrderID: "O5022", CustomerID: "C1013", ProductName: "Winter Jacket", Amount: 8500, Status: "Completed", OrderDate: "2026-05-21" },
  { OrderID: "O5023", CustomerID: "C1013", ProductName: "Woolen Scarf", Amount: 1500, Status: "Completed", OrderDate: "2026-05-21" },
  { OrderID: "O5024", CustomerID: "C1013", ProductName: "Leather Gloves", Amount: 5400, Status: "Completed", OrderDate: "2026-05-21" },
  { OrderID: "O5025", CustomerID: "C1014", ProductName: "Mechanical Keyboard", Amount: 12000, Status: "Completed", OrderDate: "2026-06-03" },
  { OrderID: "O5026", CustomerID: "C1014", ProductName: "Ergonomic Mouse", Amount: 8000, Status: "Completed", OrderDate: "2026-06-03" },
  { OrderID: "O5027", CustomerID: "C1014", ProductName: "Dual Monitor Stand", Amount: 12000, Status: "Completed", OrderDate: "2026-06-03" },
  { OrderID: "O5028", CustomerID: "C1015", ProductName: "HDMI Cable", Amount: 1100, Status: "Cancelled", OrderDate: "2026-01-21" }
];

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

console.log(`Dummy Excel file successfully generated with Stage 2 schema at: ${outputPath}`);
