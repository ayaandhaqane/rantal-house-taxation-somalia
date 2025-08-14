const Payment = require("../models/Payment");
const axios = require("axios");
const TaxCollection = require("../models/TaxCollection");
const mongoose = require("mongoose");
const Property = require('../models/Property'); // Make sure this import is at the top


exports.makePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { citizen_id, property_id, payment_method, phone } = req.body;
    // Find unpaid tax collection for the given citizen and property
    const taxCollection = await TaxCollection.findOne({
      citizen_id,
      property_id,
      status: { $ne: "paid" },
    }).session(session);
    if (!taxCollection) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: false,
        message:
          "No unpaid tax collection found for this citizen and property.",
      });
    }
    // Process WaafiPay payment
    const payload = {
      schemaVersion: "1.0",
      requestId: "10111331033",
      timestamp: "client_timestamp",
      channelName: "WEB",
      serviceName: "API_PURCHASE",
      serviceParams: {
        merchantUid: "M0910291",
        apiUserId: "1000416",
        apiKey: "API-675418888AHX",
        paymentMethod: "mwallet_account",
        payerInfo: {
          accountNo: phone,
        },
        transactionInfo: {
          referenceId: "12334",
          invoiceId: "7896504",
          amount: Number(taxCollection.total_due),
          currency: "USD",
          description: "Test USD",
        },
      },
    };
    const { data } = await axios.post("https://api.waafipay.net/asm", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.responseMsg !== "RCS_SUCCESS") {
      let errorMessage = "";
      if (data.responseMsg == "RCS_NO_ROUTE_FOUND")
        errorMessage = "Phone Number Not Found";
      else if (data.responseMsg == "RCS_USER_REJECTED")
        errorMessage = "Customer rejected to authorize payment";
      else if (data.responseMsg == "Invalid_PIN")
        errorMessage = "The PIN entered is invalid.";
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: false,
        error: errorMessage || data.responseMsg,
      });
    }
    // Create payment for the total_due
    const payment = new Payment({
      citizen_id,
      property_id,
      payment_amount: Number(taxCollection.total_due),
      payment_method: payment_method || "EVC",
    });
    await payment.save({ session });
    // Update tax collection status to paid
    taxCollection.status = "paid";
    taxCollection.paid_at = new Date();
    // Subtract the paid amount from total_due
    taxCollection.total_due =
      Number(taxCollection.total_due) - Number(payment.payment_amount);
    taxCollection.amount_due = 
      Number(taxCollection.amount_due) - Number(payment.payment_amount);
    if (taxCollection.amount_due <= 0) {
      taxCollection.amount_due = 0;
    }
    if (taxCollection.total_due <= 0) {
      taxCollection.total_due = 0;
    }
    await taxCollection.save({ session });

    await taxCollection.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      status: true,
      message: "Payment successful and tax collection updated.",
      payment,
      taxCollection,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to process payment.",
      error: error.message || error,
    });
  }
};





exports.getTransactions = async (req, res) => {
  try {
    const { citizen_id } = req.params;
    // Fetch transactions for a given citizen
    const transactions = await Payment.find({ citizen_id })
      .populate('property_id', 'property_details') // Optional: populate other fields
      .sort({ payment_date: -1 }); // Optional: Sort transactions by date

    if (!transactions.length) {
      return res.status(404).json({
        status: false,
        message: 'No transactions found for this citizen.',
      });
    }

    res.status(200).json({
      status: true,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch transactions.',
      error: error.message || error,
    });
  }
};

// This is the new function for your "Transaction Records" page
exports.getAllPaymentsForAdmin = async (req, res) => {
  try {
    // 1. Fetch all paid transactions from the Payment collection
    const paidTransactions = await Payment.find({})
      .populate({
        path: 'citizen_id',
        select: 'name phone_number'
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' }
        ]
      })
      .lean();

    // Map paid transactions to a common format
    const formattedPaid = paidTransactions.map(p => ({
      ...p,
      _id: `payment_${p._id}`, // Use a prefix to prevent key collisions
      status: 'paid',
      amount_paid: p.payment_amount,
      amount_due: { $numberDecimal: "0.00" }, // Paid transactions have no amount due
      date: p.payment_date,
    }));

    // 2. Fetch all UNPAID tax collections (status is not 'paid')
    const unpaidCollections = await TaxCollection.find({ status: { $ne: 'paid' } })
      .populate({
        path: 'citizen_id',
        select: 'name phone_number'
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' }
        ]
      })
      .lean();

    // Map unpaid collections to the same common format
    const formattedUnpaid = unpaidCollections.map(tc => ({
      ...tc,
      _id: `tc_${tc._id}`, // Use a prefix to prevent key collisions
      amount_paid: tc.amount_paid || { $numberDecimal: "0.00" }, // Unpaid might have partial payments
      amount_due: tc.amount_due,
      date: tc.due_date,
    }));
    
    // 3. Combine both lists and sort by date
    const allTransactions = [...formattedPaid, ...formattedUnpaid];
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(allTransactions);

  } catch (error) {
    console.error('Error fetching all transactions for admin:', error);
    res.status(500).json({
      message: 'Failed to fetch all transaction records.',
      error: error.message || error,
    });
  }
};


exports.getDetailedTransactions = async (req, res) => {
  try {
    const { citizen_id } = req.params;
    console.log("Fetching detailed transactions for citizen ID:", citizen_id);

    const transactions = await Payment.find({ citizen_id: citizen_id })
      .populate('property_id', 'house_rent')
      .populate('citizen_id', 'name phone_number')
      .populate({
        path: 'tax_collection_id',
        populate: { path: 'tax_id', select: 'tax_amount' }
      })
      .sort({ payment_date: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No transactions found for this citizen.',
      });
    }

    res.status(200).json({
      status: true,
      transactions: transactions.map(transaction => ({
        sender_name: transaction.citizen_id ? transaction.citizen_id.name : "N/A",
        sender_number: transaction.citizen_id ? transaction.citizen_id.phone_number : "N/A",
        house_rent: transaction.property_id ? transaction.property_id.house_rent : "N/A",
        tax: transaction.tax_collection_id && transaction.tax_collection_id.tax_id
          ? transaction.tax_collection_id.tax_id.tax_amount
          : "N/A",
        payment_amount: transaction.payment_amount,
      })),
    });
  } catch (error) {
    console.error('Error fetching detailed transactions:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch detailed transactions.',
      error: error.message || error,
    });
  }
};




exports.getPaymentsByProperty = async (req, res) => {
  try {
    const payments = await Payment.find({ property_id: req.params.propertyId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments for property', error: error.message });
  }
};


// Fetch transactions by district_id


// // Get all transactions (paid & unpaid) for a specific district
// exports.getAllPaymentsByDistrictId = async (req, res) => {
//   try {
//     const { district_id } = req.params;
//     if (!district_id) {
//       return res.status(400).json({ status: false, message: 'district_id is required' });
//     }

//     // 1. Find all property _id's in this district
//     const propertiesInDistrict = await Property.find({ district_id }).select('_id');
//     const propertyIds = propertiesInDistrict.map(p => p._id);

//     // 2. Fetch all PAID payments for these properties
//     const paidTransactions = await Payment.find({ property_id: { $in: propertyIds } })
//       .populate({
//         path: 'citizen_id',
//         select: 'name phone_number'
//       })
//       .populate({
//         path: 'property_id',
//         select: 'house_no district_id branch_id',
//         populate: [
//           { path: 'district_id', select: 'district_name' },
//           { path: 'branch_id', select: 'branch_name' }
//         ]
//       })
//       .lean();

//     // 3. Map paid transactions to a common format
//     const formattedPaid = paidTransactions.map(p => ({
//       ...p,
//       _id: `payment_${p._id}`,
//       status: 'paid',
//       amount_paid: p.payment_amount,
//       amount_due: { $numberDecimal: "0.00" },
//       date: p.payment_date,
//     }));

//     // 4. Fetch all UNPAID tax collections for these properties
//     const unpaidCollections = await TaxCollection.find({
//       property_id: { $in: propertyIds },
//       status: { $ne: 'paid' }
//     })
//       .populate({
//         path: 'citizen_id',
//         select: 'name phone_number'
//       })
//       .populate({
//         path: 'property_id',
//         select: 'house_no district_id branch_id',
//         populate: [
//           { path: 'district_id', select: 'district_name' },
//           { path: 'branch_id', select: 'branch_name' }
//         ]
//       })
//       .lean();

//     // 5. Map unpaid collections to the same format
//     const formattedUnpaid = unpaidCollections.map(tc => ({
//       ...tc,
//       _id: `tc_${tc._id}`,
//       amount_paid: tc.amount_paid || { $numberDecimal: "0.00" },
//       amount_due: tc.amount_due,
//       date: tc.due_date,
//     }));

//     // 6. Combine and sort by date
//     const allTransactions = [...formattedPaid, ...formattedUnpaid];
//     allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

//     res.status(200).json(allTransactions);

//   } catch (error) {
//     console.error('Error fetching transactions for district:', error);
//     res.status(500).json({
//       message: 'Failed to fetch transaction records for district.',
//       error: error.message || error,
//     });
//   }
// };

// Get all transactions (paid & unpaid) for a specific district
// Get all transactions (paid & unpaid) for a specific district
// const mongoose = require('mongoose');

// Get all transactions (paid & unpaid) for a specific district
exports.getAllPaymentsByDistrictId = async (req, res) => {
  try {
    const { district_id } = req.params;

    if (!district_id) {
      return res.status(400).json({ status: false, message: 'district_id is required' });
    }

    // First, check if district_id is an ObjectId or a district name
    let district = null;

    // If it's a string, attempt to find the corresponding ObjectId from the District model
    if (mongoose.Types.ObjectId.isValid(district_id)) {
      district = await mongoose.model('District').findById(district_id);
    } else {
      district = await mongoose.model('District').findOne({ district_name: district_id });
    }

    if (!district) {
      return res.status(404).json({ status: false, message: 'District not found' });
    }

    // Now use the district's ObjectId in the query
    const propertiesInDistrict = await Property.find({ district_id: district._id }).select('_id');
    const propertyIds = propertiesInDistrict.map(p => p._id);

    // 1. Fetch all PAID payments for these properties
    const paidTransactions = await Payment.find({ property_id: { $in: propertyIds } })
      .populate({
        path: 'citizen_id',
        select: 'name phone_number'
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' }
        ]
      })
      .lean();

    // 2. Map paid transactions to a common format
    const formattedPaid = paidTransactions.map(p => ({
      ...p,
      _id: `payment_${p._id}`,
      status: 'paid',
      amount_paid: p.payment_amount,
      amount_due: { $numberDecimal: "0.00" },
      date: p.payment_date,
    }));

    // 3. Fetch all UNPAID tax collections for these properties
    const unpaidCollections = await TaxCollection.find({
      property_id: { $in: propertyIds },
      status: { $ne: 'paid' }
    })
      .populate({
        path: 'citizen_id',
        select: 'name phone_number'
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' }
        ]
      })
      .lean();

    // 4. Map unpaid collections to the same format
    const formattedUnpaid = unpaidCollections.map(tc => ({
      ...tc,
      _id: `tc_${tc._id}`,
      amount_paid: tc.amount_paid || { $numberDecimal: "0.00" },
      amount_due: tc.amount_due,
      date: tc.due_date,
    }));

    // 5. Combine both lists and remove duplicates
    const allTransactions = [...formattedPaid, ...formattedUnpaid];

    // Remove duplicates by combining based on property_id and citizen_id
    const uniqueTransactions = [];
    const seen = new Set();

    allTransactions.forEach(tx => {
      const key = `${tx.property_id._id}-${tx.citizen_id._id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTransactions.push(tx);
      }
    });

    // 6. Sort by date
    uniqueTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(uniqueTransactions);

  } catch (error) {
    console.error('Error fetching transactions for district:', error);
    res.status(500).json({
      message: 'Failed to fetch transaction records for district.',
      error: error.message || error,
    });
  }
};


