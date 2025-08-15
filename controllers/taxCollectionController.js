const Property = require('../models/Property');
const Tax = require('../models/Tax');
const Payment = require('../models/Payment');
const TaxCollection = require('../models/TaxCollection');
const { getQuarterInfo } = require('../utils/quarter');

// Read Property + Tax + TaxCollection
exports.readProperty = async (req, res) => {
  try {
    const { house_no } = req.body; // Assuming we search by house number

    // Step 1: Find the existing property by house number
    const existingProperty = await Property.findOne({ house_no });

    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Step 2: Find the related tax record for this property
    const existingTax = await Tax.findOne({ property_id: existingProperty._id });

    if (!existingTax) {
      return res.status(404).json({ message: 'Tax record not found for this property' });
    }

    // Step 3: Find the related tax collection entry
    const existingTaxCollection = await TaxCollection.findOne({
      property_id: existingProperty._id,
      tax_id: existingTax._id,
    });

    if (!existingTaxCollection) {
      return res.status(404).json({ message: 'Tax collection not found for this property' });
    }

    // Step 4: Send the data back in the response
    res.status(200).json({
      property: existingProperty,
      tax: existingTax,
      taxCollection: existingTaxCollection,
    });
  } catch (error) {
    console.error('Error reading property, tax, and tax collection:', error);
    res.status(500).json({ message: 'Error reading records', error: error.message });
  }
};

// Get all tax collections with populated details
exports.getAllTaxCollections = async (req, res) => {
  try {
    const taxCollections = await TaxCollection.find()
      .populate('citizen_id', 'name phone_number')
      .populate('property_id')
      .populate('tax_id');
    res.status(200).json(taxCollections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax collections', error: error.message });
  }
};

// Mark a tax collection as fully paid
exports.markTaxAsPaid = async (req, res) => {
  try {
    const { taxCollectionId } = req.params;

    const taxCollection = await TaxCollection.findById(taxCollectionId);
    if (!taxCollection) {
      return res.status(404).json({ message: 'Tax collection record not found' });
    }

    taxCollection.status = 'paid';
    taxCollection.amount_due = 0;
    taxCollection.amount_paid = taxCollection.amount_paid || taxCollection.amount_due;
    taxCollection.paid_at = new Date();

    await taxCollection.save();

    res.status(200).json({ message: 'Tax marked as paid', taxCollection });
  } catch (error) {
    res.status(500).json({ message: 'Error marking tax as paid', error: error.message });
  }
};


exports.getCitizenTaxSummary = async (req, res) => {
  try {
    const { citizen_id } = req.params;

    // Find all tax collections for the citizen without any status filter
    const allCollections = await TaxCollection.find({ citizen_id });

    // If there are no collections, return 0 total_due
    if (allCollections.length === 0) {
      return res.status(200).json({
        citizen_id,
        total_due: 0,
        message: "No tax collections found."
      });
    }

    // Calculate the total due by summing up all collections
    const total_due = allCollections.reduce(
      (sum, tc) => sum + parseFloat(tc.amount_due.toString()),
      0
    );

    // Return only the total_due with the message
    res.status(200).json({
      citizen_id,
      total_due,
      message: `Total amount due: $${total_due.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Error fetching citizen tax summary:", error);
    res.status(500).json({ message: "Error fetching citizen tax summary", error: error.message });
  }
};



exports.getTaxCollectionsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    let collections = await TaxCollection.find({ property_id: propertyId })
      .populate('citizen_id property_id tax_id');

    // Get info about the current quarter (quarter name and due date)
    const now = new Date();
    const { quarter: currentQuarter, dueDate: currentQuarterDueDate } = getQuarterInfo(now);
    const currentYear = now.getFullYear();

    // Filter: Exclude the row for current quarter if both amount_due and amount_paid are zero
    collections = collections.filter(tc => {
      const tcQuarter = tc.quarter;
      const tcDueDate = new Date(tc.due_date);
      const tcYear = tcDueDate.getFullYear();

      // Defensive parse: handles string/Decimal128
      const amountDue = Number(tc.amount_due) || 0;
      const amountPaid = Number(tc.amount_paid) || 0;

      if (
        tcQuarter === currentQuarter &&
        tcYear === currentYear &&
        amountDue === 0 &&
        amountPaid === 0
      ) {
        return false; // Exclude dummy current quarter
      }
      return true;
    });

    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tax collections', error: error.message });
  }
};
