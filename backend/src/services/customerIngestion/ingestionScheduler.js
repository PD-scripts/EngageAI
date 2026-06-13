const customerGenerator = require('./customerGenerator');
const customerIngestionService = require('./customerIngestionService');

function start() {
  const INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours (43,200,000 ms)
  
  console.log('[Ingestion Scheduler] Automated customer ingestion scheduler started (Interval: 12h).');
  
  setInterval(async () => {
    try {
      // Generate between 10 and 20 customers on every tick
      const count = Math.floor(Math.random() * (20 - 10 + 1)) + 10; 
      console.log(`[Ingestion Scheduler] Scheduled tick. Generating ${count} realistic customer signups...`);
      
      for (let i = 0; i < count; i++) {
        const dummyCustomer = customerGenerator.generateDummyCustomer();
        const result = await customerIngestionService.ingestCustomer(dummyCustomer);
        console.log(`[Ingestion Scheduler] Automatically ingested: ${result.customer.name} (ID: ${result.customer.customerId}, Update: ${result.isUpdate})`);
      }
    } catch (error) {
      console.error('[Ingestion Scheduler] Error during scheduled background ingestion:', error.message);
    }
  }, INTERVAL_MS);
}

module.exports = {
  start
};
