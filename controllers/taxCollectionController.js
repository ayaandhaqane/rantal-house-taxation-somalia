// const Property = require('../models/Property');
// const Tax = require('../models/Tax');
// const Payment = require('../models/Payment');
// const TaxCollection = require('../models/TaxCollection');
// const { getQuarterInfo } = require('../utils/quarter');

// // Create Property + Tax + TaxCollection
// exports.createProperty = async (req, res) => {
//   try {
//     const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, register_date } = req.body;

//     const propertyDate = register_date ? new Date(register_date) : new Date();

//     const newProperty = new Property({
//       citizen_id,
//       house_no,
//       district_id,
//       branch_id,
//       zone_id,
//       house_rent,
//       register_date: propertyDate,
//     });

//     const savedProperty = await newProperty.save();

//     const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: taxAmount,
//     });

//     const savedTax = await newTax.save();

//     const { quarter, dueDate } = getQuarterInfo(propertyDate);

//     const taxCollectionEntry = new TaxCollection({
//       citizen_id,
//       property_id: savedProperty._id,
//       tax_id: savedTax._id,
//       quarter,
//       due_date: dueDate,
//       amount_due: taxAmount,
//       amount_paid: 0,
//       status: 'due',
//     });

//     await taxCollectionEntry.save();

//     res.status(201).json({
//       property: savedProperty,
//       tax: savedTax,
//       taxCollection: taxCollectionEntry,
//     });
//   } catch (error) {
//     console.error('Error creating property, tax, and tax collection:', error);
//     res.status(500).json({ message: 'Error creating records', error: error.message });
//   }
// };

// // Create payment and update tax collection status accordingly
// exports.createPayment = async (req, res) => {
//   try {
//     const { citizen_id, property_id, payment_amount, payment_method } = req.body;

//     const newPayment = new Payment({ citizen_id, property_id, payment_amount, payment_method });
//     await newPayment.save();

//     // Find next due tax collection (nearest due date >= today)
//     const now = new Date();
//     const taxCollection = await TaxCollection.findOne({
//       citizen_id,
//       property_id,
//       due_date: { $gte: now },
//       status: { $in: ['due', 'partial'] },
//     }).sort({ due_date: 1 });

//     if (taxCollection) {
//       const amountDue = parseFloat(taxCollection.amount_due.toString());
//       const amountPaid = taxCollection.amount_paid ? parseFloat(taxCollection.amount_paid.toString()) : 0;
//       const totalPaid = amountPaid + payment_amount;

//       if (totalPaid >= amountDue) {
//         taxCollection.amount_paid = amountDue;
//         taxCollection.amount_due = 0;
//         taxCollection.status = 'paid';
//         taxCollection.paid_at = new Date();
//       } else {
//         taxCollection.amount_paid = totalPaid;
//         taxCollection.amount_due = amountDue - totalPaid;
//         taxCollection.status = 'partial';
//       }

//       await taxCollection.save();
//     }

//     res.status(201).json({ payment: newPayment, taxCollection });
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Get all tax collections with populated details
// exports.getAllTaxCollections = async (req, res) => {
//   try {
//     const taxCollections = await TaxCollection.find()
//       .populate('citizen_id', 'name phone_number')
//       .populate('property_id')
//       .populate('tax_id');
//     res.status(200).json(taxCollections);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tax collections', error: error.message });
//   }
// };

// // Mark a tax collection as fully paid
// exports.markTaxAsPaid = async (req, res) => {
//   try {
//     const { taxCollectionId } = req.params;

//     const taxCollection = await TaxCollection.findById(taxCollectionId);
//     if (!taxCollection) {
//       return res.status(404).json({ message: 'Tax collection record not found' });
//     }

//     taxCollection.status = 'paid';
//     taxCollection.amount_due = 0;
//     taxCollection.amount_paid = taxCollection.amount_paid || taxCollection.amount_due;
//     taxCollection.paid_at = new Date();

//     await taxCollection.save();

//     res.status(200).json({ message: 'Tax marked as paid', taxCollection });
//   } catch (error) {
//     res.status(500).json({ message: 'Error marking tax as paid', error: error.message });
//   }
// };










const Property = require('../models/Property');
const Tax = require('../models/Tax');
const Payment = require('../models/Payment');
const TaxCollection = require('../models/TaxCollection');
const { getQuarterInfo } = require('../utils/quarter');

// Create Property + Tax + TaxCollection
exports.createProperty = async (req, res) => {
  try {
    const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, register_date } = req.body;

    const propertyDate = register_date ? new Date(register_date) : new Date();

    const newProperty = new Property({
      citizen_id,
      house_no,
      district_id,
      branch_id,
      zone_id,
      house_rent,
      register_date: propertyDate,
    });

    const savedProperty = await newProperty.save();

    const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

    const newTax = new Tax({
      property_id: savedProperty._id,
      tax_amount: taxAmount,
    });

    const savedTax = await newTax.save();

    const { quarter, dueDate } = getQuarterInfo(propertyDate);

    const taxCollectionEntry = new TaxCollection({
      citizen_id,
      property_id: savedProperty._id,
      tax_id: savedTax._id,
      quarter,
      due_date: dueDate,
      amount_due: taxAmount,
      amount_paid: 0,
      status: 'due',
    });

    await taxCollectionEntry.save();

    res.status(201).json({
      property: savedProperty,
      tax: savedTax,
      taxCollection: taxCollectionEntry,
    });
  } catch (error) {
    console.error('Error creating property, tax, and tax collection:', error);
    res.status(500).json({ message: 'Error creating records', error: error.message });
  }
};

// Create payment and update tax collection status accordingly
exports.createPayment = async (req, res) => {
  try {
    const { citizen_id, property_id, payment_amount, payment_method } = req.body;

    const newPayment = new Payment({ citizen_id, property_id, payment_amount, payment_method });
    await newPayment.save();

    // Find next due tax collection (nearest due date >= today)
    const now = new Date();
    const taxCollection = await TaxCollection.findOne({
      citizen_id,
      property_id,
      due_date: { $gte: now },
      status: { $in: ['due', 'partial'] },
    }).sort({ due_date: 1 });

    if (taxCollection) {
      const amountDue = parseFloat(taxCollection.amount_due.toString());
      const amountPaid = taxCollection.amount_paid ? parseFloat(taxCollection.amount_paid.toString()) : 0;
      const totalPaid = amountPaid + payment_amount;

      if (totalPaid >= amountDue) {
        taxCollection.amount_paid = amountDue;
        taxCollection.amount_due = 0;
        taxCollection.status = 'paid';
        taxCollection.paid_at = new Date();
      } else {
        taxCollection.amount_paid = totalPaid;
        taxCollection.amount_due = amountDue - totalPaid;
        taxCollection.status = 'partial';
      }

      await taxCollection.save();
    }

    res.status(201).json({ payment: newPayment, taxCollection });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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


// Summary endpoint: Soo saar total quarters aan la bixin, lacagta, taariikhaha ugu horeeya iyo ugu dambeysa
exports.getCitizenTaxSummary = async (req, res) => {
  try {
    const { citizen_id } = req.params;

    // Hel tax collections aan la bixin (due, overdue, partial)
    const unpaidCollections = await TaxCollection.find({
      citizen_id,
      status: { $in: ['due', 'overdue', 'partial'] }
    });

    if (unpaidCollections.length === 0) {
      return res.status(200).json({
        citizen_id,
        total_unpaid_quarters: 0,
        amount_per_quarter: 0,
        total_due: 0,
        earliest_due_date: null,
        latest_due_date: null,
        message: "No unpaid tax collections."
      });
    }

    // Tirada quarters aan la bixin
    const total_unpaid_quarters = unpaidCollections.length;

    // Lacagta quater kasta (waxaan qaadaneynaa midka koowaad)
    const amount_per_quarter = parseFloat(unpaidCollections[0].amount_due.toString());

    // Wadarta lacagta laga rabo
    const total_due = unpaidCollections.reduce((sum, tc) => sum + parseFloat(tc.amount_due.toString()), 0);

    // Hel taariikhaha ugu horeeya iyo ugu dambeysa ee dues
    const dueDates = unpaidCollections.map(tc => tc.due_date.getTime());
    const earliest_due_date = new Date(Math.min(...dueDates));
    const latest_due_date = new Date(Math.max(...dueDates));

    // Farriinta
    const message = `Total unpaid quarters: ${total_unpaid_quarters}, total amount due: $${total_due.toFixed(2)}`;

    res.status(200).json({
      citizen_id,
      total_unpaid_quarters,
      amount_per_quarter,
      total_due,
      earliest_due_date,
      latest_due_date,
      message,
    });
  } catch (error) {
    console.error("Error fetching citizen tax summary:", error);
    res.status(500).json({ message: "Error fetching citizen tax summary", error: error.message });
  }
};

