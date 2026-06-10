const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'Xeno_CRM_Dummy_Data.xlsx');

// Dummy Customer Data
const customers = [
  { CustomerID: "C1001", FirstName: "Aarav", LastName: "Sharma", Email: "aarav.sharma@example.com", Phone: "9876543210", City: "Mumbai", CreatedAt: "2026-01-10" },
  { CustomerID: "C1002", FirstName: "Ananya", LastName: "Patel", Email: "ananya.patel@example.com", Phone: "9876543211", City: "Delhi", CreatedAt: "2026-01-12" },
  { CustomerID: "C1003", FirstName: "Vivaan", LastName: "Mehta", Email: "vivaan.mehta@example.com", Phone: "9876543212", City: "Bangalore", CreatedAt: "2026-01-15" },
  { CustomerID: "C1004", FirstName: "Diya", LastName: "Iyer", Email: "diya.iyer@example.com", Phone: "9876543213", City: "Chennai", CreatedAt: "2026-02-01" },
  { CustomerID: "C1005", FirstName: "Kabir", LastName: "Singh", Email: "kabir.singh@example.com", Phone: "9876543214", City: "Kolkata", CreatedAt: "2026-02-05" },
  { CustomerID: "C1006", FirstName: "Ira", LastName: "Joshi", Email: "ira.joshi@example.com", Phone: "9876543215", City: "Pune", CreatedAt: "2026-02-10" },
  { CustomerID: "C1007", FirstName: "Sai", LastName: "Reddy", Email: "sai.reddy@example.com", Phone: "9876543216", City: "Hyderabad", CreatedAt: "2026-03-01" },
  { CustomerID: "C1008", FirstName: "Riya", LastName: "Sen", Email: "riya.sen@example.com", Phone: "9876543217", City: "Kolkata", CreatedAt: "2026-03-05" },
  { CustomerID: "C1009", FirstName: "Arjun", LastName: "Gupta", Email: "arjun.gupta@example.com", Phone: "9876543218", City: "Mumbai", CreatedAt: "2026-03-12" },
  { CustomerID: "C1010", FirstName: "Meera", LastName: "Nair", Email: "meera.nair@example.com", Phone: "9876543219", City: "Kochi", CreatedAt: "2026-03-20" }
];

// Dummy Order Data
const orders = [
  { OrderID: "O5001", CustomerID: "C1001", OrderDate: "2026-01-15", Amount: 2500, Status: "Completed" },
  { OrderID: "O5002", CustomerID: "C1002", OrderDate: "2026-01-18", Amount: 4200, Status: "Completed" },
  { OrderID: "O5003", CustomerID: "C1001", OrderDate: "2026-02-02", Amount: 1500, Status: "Completed" },
  { OrderID: "O5004", CustomerID: "C1004", OrderDate: "2026-02-08", Amount: 899, Status: "Completed" },
  { OrderID: "O5005", CustomerID: "C1005", OrderDate: "2026-02-15", Amount: 3100, Status: "Completed" },
  { OrderID: "O5006", CustomerID: "C1003", OrderDate: "2026-02-20", Amount: 5500, Status: "Completed" },
  { OrderID: "O5007", CustomerID: "C1006", OrderDate: "2026-03-01", Amount: 1250, Status: "Shipped" },
  { OrderID: "O5008", CustomerID: "C1007", OrderDate: "2026-03-05", Amount: 9990, Status: "Completed" },
  { OrderID: "O5009", CustomerID: "C1001", OrderDate: "2026-03-10", Amount: 1800, Status: "Completed" },
  { OrderID: "O5010", CustomerID: "C1008", OrderDate: "2026-03-12", Amount: 4500, Status: "Completed" },
  { OrderID: "O5011", CustomerID: "C1009", OrderDate: "2026-03-15", Amount: 2300, Status: "Shipped" },
  { OrderID: "O5012", CustomerID: "C1010", OrderDate: "2026-03-22", Amount: 1200, Status: "Pending" }
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

console.log(`Dummy Excel file successfully generated at: ${outputPath}`);
