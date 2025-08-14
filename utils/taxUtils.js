const TaxCollection = require('../models/TaxCollection');
const Citizen = require('../models/Citizen');

function isDateActive(date, activationDate, inactivationDate) {
  if (!inactivationDate) return date >= activationDate; // still active
  return date >= activationDate && date <= inactivationDate;
}

async function calculateOutstandingTax(citizenId, propertyId) {
  const now = new Date();

  const citizen = await Citizen.findById(citizenId);
  if (!citizen) throw new Error('Citizen not found');

  const taxCollections = await TaxCollection.find({
    citizen_id: citizenId,
    property_id: propertyId,
    status: { $in: ['due', 'overdue'] },
    due_date: { $lte: now }
  });

  let totalDue = 0;
  for (const tax of taxCollections) {
    if (isDateActive(tax.due_date, citizen.activation_date, citizen.inactivation_date)) {
      totalDue += parseFloat(tax.amount_due.toString());
    } else {
      console.log(`Skipping tax for due date ${tax.due_date} as citizen is inactive.`);
    }
  }

  return totalDue;
}

module.exports = { calculateOutstandingTax };

