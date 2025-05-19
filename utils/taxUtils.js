const TaxCollection = require('../models/TaxCollection');

async function calculateOutstandingTax(citizenId, propertyId) {
  const now = new Date();

  // Find all TaxCollection docs for this citizen and property
  // that are due or overdue up to now
  const taxCollections = await TaxCollection.find({
    citizen_id: citizenId,
    property_id: propertyId,
    status: { $in: ['due', 'overdue', 'partial'] },
    due_date: { $lte: now }
  });

  let totalDue = 0;
  for (const tc of taxCollections) {
    totalDue += parseFloat(tc.amount_due.toString());
  }

  return totalDue;
}

module.exports = { calculateOutstandingTax };
