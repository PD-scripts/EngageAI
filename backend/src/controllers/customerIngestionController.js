const customerIngestionService = require('../services/customerIngestion/customerIngestionService');
const customerGenerator = require('../services/customerIngestion/customerGenerator');

/**
 * POST /api/ingestion/customer
 * Endpoint to ingest a single customer.
 */
async function ingestSingleCustomer(req, res) {
  try {
    const { customerId, name, email, phone, city, dob } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Missing required field: 'name'" });
    }
    
    if (!email && !phone) {
      return res.status(400).json({ error: "Ingestion requires at least 'email' or 'phone' for identification." });
    }
    
    const result = await customerIngestionService.ingestCustomer({
      customerId,
      name,
      email,
      phone,
      city,
      dob
    });
    
    res.json({
      success: true,
      message: result.isUpdate ? "Customer updated successfully" : "Customer created successfully",
      customer: result.customer
    });
  } catch (error) {
    console.error('[Ingestion Controller] Single ingestion failed:', error.message);
    res.status(500).json({ error: error.message || "Internal Server Error during ingestion" });
  }
}

/**
 * POST /api/ingestion/generate
 * Endpoint to bulk generate and ingest realistic customers.
 */
async function bulkGenerate(req, res) {
  try {
    const count = Number(req.body.count) || 50;
    
    if (count <= 0 || count > 500) {
      return res.status(400).json({ error: "Bulk count must be between 1 and 500." });
    }
    
    console.log(`[Ingestion Controller] Initiating bulk generation of ${count} customers...`);
    
    let createdCount = 0;
    let updatedCount = 0;
    const ingestedList = [];
    
    for (let i = 0; i < count; i++) {
      const dummy = customerGenerator.generateDummyCustomer();
      const result = await customerIngestionService.ingestCustomer(dummy);
      
      if (result.isUpdate) {
        updatedCount++;
      } else {
        createdCount++;
      }
      ingestedList.push(result.customer);
    }
    
    res.json({
      success: true,
      message: `Successfully processed ${count} generated customers.`,
      stats: {
        totalProcessed: count,
        created: createdCount,
        updated: updatedCount
      },
      customers: ingestedList.slice(0, 5) // Return first 5 as sample
    });
  } catch (error) {
    console.error('[Ingestion Controller] Bulk generation failed:', error.message);
    res.status(500).json({ error: "Internal Server Error during bulk generation" });
  }
}

module.exports = {
  ingestSingleCustomer,
  bulkGenerate
};
