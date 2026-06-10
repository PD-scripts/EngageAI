const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Utility function to load and parse an Excel sheet into a JSON array.
 * Reads directly from the file in backend/data/.
 */
function readExcelSheet(sheetName) {
  // Resolve absolute path to crm2/backend/data/Xeno_CRM_Dummy_Data.xlsx
  const filePath = path.resolve(__dirname, '../../data/Xeno_CRM_Dummy_Data.xlsx');

  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel data file Xeno_CRM_Dummy_Data.xlsx not found at: ${filePath}`);
  }

  // Read workbook
  const workbook = XLSX.readFile(filePath);
  
  // Get worksheet
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook at ${filePath}`);
  }

  // Convert to JSON
  return XLSX.utils.sheet_to_json(worksheet);
}

module.exports = {
  readExcelSheet
};
