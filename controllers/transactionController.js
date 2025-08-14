const Transaction = require('../models/Transaction');
const Property = require('../models/Property');
const TaxCollection = require('../models/TaxCollection');
const Payment = require('../models/Payment');
const Citizen = require('../models/Citizen'); 


exports.createTransaction = async (req, res) => {
  try {
    const { 
      property_id, 
      tax_collection_id, 
      payment_id, 
      citizen_id, 
      amount_paid, 
      amount_due, 
      status 
    } = req.body;

    // Ensure a valid status is passed
    const validStatuses = ['paid',  'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Must be one of: paid, partial, overdue' });
    }

    // Ensure citizen_id is provided
    if (!citizen_id) {
      return res.status(400).json({ message: 'Citizen ID is required' });
    }

    // Find the relevant property, tax collection, and payment
    const property = await Property.findById(property_id);
    const taxCollection = await TaxCollection.findById(tax_collection_id);
    const payment = payment_id ? await Payment.findById(payment_id) : null;
    const citizen = await Citizen.findById(citizen_id); // Fetch citizen

    if (!property || !taxCollection || !citizen) {
      return res.status(400).json({ message: 'Invalid property, tax collection, or citizen' });
    }

    // Create new transaction record
    const newTransaction = new Transaction({
      property_id,
      tax_collection_id,
      payment_id,
      citizen_id,  // Add citizen_id here
      amount_paid,
      amount_due,
      status,
    });

    // Check if amount_due > 0 and proceed to create the transaction
    if (amount_due > 0) {
      // Save transaction if there's due amount
      await newTransaction.save();

      // Update tax collection status based on payment status
      if (status === 'paid') {
        taxCollection.status = 'paid';
        taxCollection.amount_due = 0;
      } else if (status === 'partial') {
        taxCollection.status = 'partial';
        taxCollection.amount_due -= amount_paid;
      }

      await taxCollection.save();
      
      return res.status(201).json({ message: 'Transaction created successfully', data: newTransaction });
    } else {
      return res.status(400).json({ message: 'No due amount, no transaction created' });
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};


// exports.getTransactions = async (req, res) => {

//   try {
//     const transactions = await Transaction.find()
//       .populate({
//         path: "property_id",
//         select: "house_no district_id branch_id",
//         populate: [
//           {
//             path: "district_id",
//             select: "district_name"
//           },
//           {
//             path: "branch_id",
//             select: "branch_name"
//           }
//         ]
//       })  // Populate with house_no field from Property model
      
//       .populate("tax_collection_id", "status amount_due")  // Populate with status and amount_due fields from TaxCollection model
//       .populate("payment_id", "payment_amount payment_method")  // Populate with payment amount and method
//       .populate("citizen_id", "name phone_number");  // Populate with citizen name and phone_number
      

//     res.status(200).json(transactions);  // Send the populated transactions
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({ message: "Error fetching transactions", error: error.message });
//   }
// };
// In transactionController.js
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: "property_id",
        select: "house_no district_id branch_id",
        populate: [
          { path: "district_id", select: "district_name" },
          { path: "branch_id", select: "branch_name" }
        ]
      })
      .populate("citizen_id", "name phone_number")
      .sort({ createdAt: -1 }); // Newest first

    // Transform data for frontend
    const transformed = transactions.map(t => ({
      ...t._doc,
      amount_paid: t.amount_paid || 0,
      status: t.status === 'due' ? 'overdue' : t.status // Map 'due' to 'overdue'
    }));

    res.status(200).json(transformed);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
};



// Add to transactionController.js
exports.getTransactionStats = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('property_id');
    
    const paidTransactions = transactions.filter(t => t.status === 'paid');
    const overdueTransactions = transactions.filter(t => t.status === 'due' || t.status === 'overdue');
    
    const stats = {
      totalRevenue: paidTransactions.reduce((sum, t) => sum + (t.amount_paid || 0), 0),
      totalProperties: await Property.countDocuments(),
      paymentRate: transactions.length > 0 
        ? Math.round((paidTransactions.length / transactions.length) * 100)
        : 0,
      avgTaxAmount: paidTransactions.length > 0
        ? paidTransactions.reduce((sum, t) => sum + (t.amount_paid || 0), 0) / paidTransactions.length
        : 0,
      paid: paidTransactions.length,
      overdue: overdueTransactions.length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};


// Get all transactions for a property
exports.getTransactionsByPropertyId = async (req, res) => {
  try {
    const { property_id } = req.params;
    const transactions = await Transaction.find({ property_id })
      .populate('property_id', 'house_no')
      .populate('tax_collection_id', 'status amount_due')
      .populate('payment_id', 'payment_amount payment_method');

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this property' });
    }

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Get transactions by tax collection status (paid, overdue, etc.)
exports.getTransactionsByTaxCollectionStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const transactions = await Transaction.find({ status })
      .populate('property_id', 'house_no')
      .populate('tax_collection_id', 'status amount_due')
      .populate('payment_id', 'payment_amount payment_method');

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: `No ${status} transactions found` });
    }

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};


// In your transactionController.js
// Add this with your other exports at the bottom of the file
// exports.getTransactionsByDistrict = async (req, res) => {
//   try {
//     // For employees, check if they're accessing their own district's transactions
//     if (req.user.role === 'user' && req.user.district.toString() !== req.params.districtId) {
//       return res.status(403).json({ message: 'Unauthorized to access these transactions' });
//     }

//     const transactions = await Transaction.find({
//       'property_id.district_id': req.params.districtId
//     })
//     .populate('property_id')
//     .populate('citizen_id');

//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// transactionController.js
exports.getTransactionsByDistrict = async (req, res) => {
  try {
    const districtId = req.params.districtId;

    // ... (your auth check here)

    const transactions = await Transaction.find()
      .populate({
        path: 'property_id',
        match: { district_id: districtId },
        select: 'house_no district_id branch_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' }
        ]
      })
      .populate('citizen_id', 'name phone_number') // <--- Make sure 'phone_number' is included!
      .sort({ created_at: -1 });

    const filteredTransactions = transactions.filter(tx => tx.property_id !== null);

    res.status(200).json(filteredTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};


