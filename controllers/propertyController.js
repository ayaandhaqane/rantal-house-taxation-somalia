const Property = require('../models/Property');
const Tax = require('../models/Tax');
const TaxCollection = require('../models/TaxCollection');
const District = require('../models/District'); 
const Branch = require('../models/Branch'); 
const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');
const mongoose = require('mongoose');


// exports.createProperty = async (req, res) => {
//   try {
//     const {
//       citizen_id,
//       house_no,
//       district_id,
//       branch_id,
//       zone_id,
//       house_rent,
//       register_date,
//     } = req.body;

//     const propertyDate = register_date ? new Date(register_date) : new Date();

//     // Create new property record
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

//     // Calculate full quarter tax (3 months rent * 5%)
//     const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

//     // Adjust tax for first quarter depending on month of registration
//     const month = propertyDate.getMonth() + 1; // 1-12
//     let adjustedTaxFirstQuarter = fullQuarterTax;

//     if ([1, 2, 3].includes(month)) {
//       if (month === 1) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 2) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 3) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([4, 5, 6].includes(month)) {
//       if (month === 4) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 5) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 6) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([7, 8, 9].includes(month)) {
//       if (month === 7) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 8) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 9) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([10, 11, 12].includes(month)) {
//       if (month === 10) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 11) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 12) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     }

//     // Create tax record for property
//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: fullQuarterTax,
//     });
//     const savedTax = await newTax.save();

//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     // Fetch all existing tax collections for this property & citizen
//     const existingCollections = await TaxCollection.find({
//       citizen_id,
//       property_id: savedProperty._id,
//     });

//     // Map existing quarters for quick lookup
//     const existingQuartersSet = new Set(existingCollections.map(tc => tc.quarter));

//     let totalDueSum = 0;
//     let isFirstQuarter = true;
//     const taxCollections = [];

//     for (const { quarter, dueDate } of quarters) {
//       // Skip quarters already existing
//       if (existingQuartersSet.has(quarter)) continue;

//       // The last month of the quarter (March, June, Sept, Dec)
//       const quarterLastMonth = dueDate.getMonth() + 1;
//       const currentMonth = now.getMonth() + 1;

//       let amountDue = 0;

//       // No charge if current month is the last month of quarter (payment due month)
//       if (currentMonth === quarterLastMonth) {
//         amountDue = 0;
//       } else {
//         if (isFirstQuarter) {
//           if (propertyDate <= dueDate && now >= dueDate) {
//             const registerMonth = propertyDate.getMonth() + 1;
//             const quarterStartMonth = quarterLastMonth - 2;
//             const monthsPassedInQuarter = registerMonth - quarterStartMonth + 1;

//             if (monthsPassedInQuarter === 1) amountDue = fullQuarterTax;
//             else if (monthsPassedInQuarter === 2) amountDue = parseFloat(house_rent) * 2 * 0.05;
//             else if (monthsPassedInQuarter === 3) amountDue = parseFloat(house_rent) * 1 * 0.05;
//             else amountDue = fullQuarterTax;
//           } else {
//             amountDue = 0;
//           }
//         } else {
//           amountDue = now >= dueDate ? fullQuarterTax : 0;
//         }
//       }

//       if (amountDue > 0) totalDueSum += amountDue;

//       const message = `Total unpaid quarters: ${quarters.length}, total amount due: $${totalDueSum.toFixed(2)}`;

//       const newTaxCollection = new TaxCollection({
//         citizen_id,
//         property_id: savedProperty._id,
//         tax_id: savedTax._id,
//         quarter,
//         register_date: propertyDate,
//         due_date: dueDate,
//         amount_due: amountDue,
//         amount_paid: 0,
//         status: amountDue === 0 ? 'paid' : 'due',
//         total_unpaid_quarters: quarters.length,
//         amount_per_quarter: fullQuarterTax,
//         total_due: totalDueSum,
//         earliest_due_date: quarters.length > 0 ? quarters[0].dueDate : null,
//         latest_due_date: quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null,
//         message,
//         property_register_date: propertyDate,
//       });

//       await newTaxCollection.save();
//       taxCollections.push(newTaxCollection);

//       isFirstQuarter = false;
//     }

//     res.status(201).json({
//       property: savedProperty,
//       tax: savedTax,
//       taxCollections,
//     });

//   } catch (error) {
//     console.error('Error creating property, tax, and tax collections:', error);
//     res.status(500).json({ message: 'Error creating records', error: error.message });
//   }
// };





// exports.createProperty = async (req, res) => {
//   try {
//     const {
//       citizen_id,
//       house_no,
//       district_id,
//       branch_id,
//       zone_id,
//       house_rent,
//       register_date,
//     } = req.body;

//     const propertyDate = register_date ? new Date(register_date) : new Date();

//     // Create new property record
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

//     // Calculate full quarter tax (3 months rent * 5%)
//     const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

//     // Create tax record for property
//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: fullQuarterTax,
//     });
//     const savedTax = await newTax.save();

//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     // Determine the current quarter and year
//     const currentMonth = now.getMonth() + 1;
//     const currentYear = now.getFullYear();
//     let currentQuarter = '';
//     if ([1, 2, 3].includes(currentMonth)) currentQuarter = 'Q1';
//     else if ([4, 5, 6].includes(currentMonth)) currentQuarter = 'Q2';
//     else if ([7, 8, 9].includes(currentMonth)) currentQuarter = 'Q3';
//     else if ([10, 11, 12].includes(currentMonth)) currentQuarter = 'Q4';

//     // Fetch all existing tax collections for this property & citizen
//     const existingCollections = await TaxCollection.find({
//       citizen_id,
//       property_id: savedProperty._id,
//     });

//     // Map existing quarters for quick lookup
//     const existingQuartersSet = new Set(existingCollections.map(tc => tc.quarter + '-' + tc.due_date.getFullYear()));

//     let totalDueSum = 0;
//     const taxCollections = [];

//     for (const { quarter, dueDate } of quarters) {
//       const year = dueDate.getFullYear();
//       const key = quarter + '-' + year;
//       if (existingQuartersSet.has(key)) continue;

//       let amountDue = fullQuarterTax;
//       let status = 'due';

//       // Only the current quarter of the current year should be zero/paid
//       if (
//         year === currentYear &&
//         quarter === currentQuarter
//       ) {
//         amountDue = 0;
//         status = 'paid';
//       }

//       if (amountDue > 0) totalDueSum += amountDue;

//       const message = `Total unpaid quarters: ${quarters.length}, total amount due: $${totalDueSum.toFixed(2)}`;

//       const newTaxCollection = new TaxCollection({
//         citizen_id,
//         property_id: savedProperty._id,
//         tax_id: savedTax._id,
//         quarter,
//         register_date: propertyDate,
//         due_date: dueDate,
//         amount_due: amountDue,
//         amount_paid: 0,
//         status,
//         total_unpaid_quarters: quarters.length,
//         amount_per_quarter: fullQuarterTax,
//         total_due: totalDueSum,
//         earliest_due_date: quarters.length > 0 ? quarters[0].dueDate : null,
//         latest_due_date: quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null,
//         message,
//         property_register_date: propertyDate,
//       });

//       await newTaxCollection.save();
//       taxCollections.push(newTaxCollection);
//     }

//     res.status(201).json({
//       property: savedProperty,
//       tax: savedTax,
//       taxCollections,
//     });

//   } catch (error) {
//     console.error('Error creating property, tax, and tax collections:', error);
//     res.status(500).json({ message: 'Error creating records', error: error.message });
//   }
// };



// Helper function to calculate months left in the quarter (including the registration month)
function monthsLeftInQuarter(registerDate, quarterDueDate) {
  const regMonth = registerDate.getMonth() + 1;   // 1-12
  const dueMonth = quarterDueDate.getMonth() + 1; // 3, 6, 9, or 12
  const startMonth = dueMonth - 2;                // 1, 4, 7, 10
  if (regMonth > dueMonth) return 0; // Registration after quarter ended
  if (regMonth < startMonth) return 3; // Registered before this quarter started
  return dueMonth - regMonth + 1; // Months left including registration month
}

exports.createProperty = async (req, res) => {
  try {
    const {
      citizen_id,
      house_no,
      district_id,
      branch_id,
      zone_id,
      house_rent,
      register_date,
    } = req.body;

    const propertyDate = register_date ? new Date(register_date) : new Date();

    // Create property
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

    // Calculate full quarter tax (3 months rent * 5%)
    const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

    // Create tax record
    const newTax = new Tax({
      property_id: savedProperty._id,
      tax_amount: fullQuarterTax,
    });
    const savedTax = await newTax.save();

    const now = new Date();
    const quarters = getAllQuartersBetween(propertyDate, now);

    // Current quarter (at today)
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    let currentQuarter = '';
    if ([1, 2, 3].includes(currentMonth)) currentQuarter = 'Q1';
    else if ([4, 5, 6].includes(currentMonth)) currentQuarter = 'Q2';
    else if ([7, 8, 9].includes(currentMonth)) currentQuarter = 'Q3';
    else if ([10, 11, 12].includes(currentMonth)) currentQuarter = 'Q4';

    // Prevent double-creation
    const existingCollections = await TaxCollection.find({
      citizen_id,
      property_id: savedProperty._id,
    });
    const existingQuartersSet = new Set(existingCollections.map(tc => tc.quarter + '-' + tc.due_date.getFullYear()));

    let totalDueSum = 0;
    const taxCollections = [];
    let isFirstQuarter = true;

    for (const { quarter, dueDate } of quarters) {
      const year = dueDate.getFullYear();
      const key = quarter + '-' + year;
      if (existingQuartersSet.has(key)) continue;

      let amountDue = fullQuarterTax;
      let status = 'due';

      // Prorate for first quarter after registration
      if (isFirstQuarter) {
        const months = monthsLeftInQuarter(propertyDate, dueDate);
        amountDue = (parseFloat(house_rent) * months) * 0.05;
        isFirstQuarter = false;
      }

      // If it's the current ongoing quarter, you can set it paid, or keep as 'due'
      if (year === currentYear && quarter === currentQuarter) {
        amountDue = 0; // Uncomment if you want current quarter set as paid/free by default
        status = 'paid';
      }

      if (amountDue > 0) totalDueSum += amountDue;

      const message = `Total unpaid quarters: ${quarters.length}, total amount due: $${totalDueSum.toFixed(2)}`;

      const newTaxCollection = new TaxCollection({
        citizen_id,
        property_id: savedProperty._id,
        tax_id: savedTax._id,
        quarter,
        register_date: propertyDate,
        due_date: dueDate,
        amount_due: amountDue,
        amount_paid: 0,
        status,
        total_unpaid_quarters: quarters.length,
        amount_per_quarter: fullQuarterTax,
        total_due: totalDueSum,
        earliest_due_date: quarters.length > 0 ? quarters[0].dueDate : null,
        latest_due_date: quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null,
        message,
        property_register_date: propertyDate,
      });

      await newTaxCollection.save();
      taxCollections.push(newTaxCollection);
    }

    res.status(201).json({
      property: savedProperty,
      tax: savedTax,
      taxCollections,
    });

  } catch (error) {
    console.error('Error creating property, tax, and tax collections:', error);
    res.status(500).json({ message: 'Error creating records', error: error.message });
  }
};


exports.calculatePropertyTax = async (req, res) => {
  try {
    const { house_no, branch, district, zone, house_rent } = req.query;
      console.log("House No:", house_no);
      console.log("Branch:", branch);
      console.log("District:", district);
      console.log("Zone:", zone);
      console.log("House Rent:", house_rent);

    // Validate if all required fields are present
    if (!house_rent || !house_no || !branch || !district || !zone) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Assume 4 quarters per year and tax for each quarter
    const quartersPerYear = 4;
    const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05; // 3 months per quarter

    let totalDueSum = 0;

    // Loop to calculate tax for each quarter
    for (let i = 0; i < quartersPerYear; i++) {
      totalDueSum += fullQuarterTax;
    }

    return res.json({ totalTax: totalDueSum.toFixed(2) });
  } catch (err) {
    console.error('Error calculating property tax:', err);
    res.status(500).json({ error: 'Error calculating property tax', details: err.message });
  }
};


exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('citizen_id', 'name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id)
      .populate('citizen_id', 'name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update property document first
    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const houseRent = updateData.house_rent !== undefined
      ? parseFloat(updateData.house_rent)
      : parseFloat(updatedProperty.house_rent);

    const registerDate = updateData.register_date
      ? new Date(updateData.register_date)
      : updatedProperty.register_date;

    // Calculate full quarter tax (3 months rent * 5%)
    const fullQuarterTax = houseRent * 3 * 0.05;

    // Find or create tax record for the property
    let taxRecord = await Tax.findOne({ property_id: id });
    if (taxRecord) {
      taxRecord.tax_amount = fullQuarterTax;
      await taxRecord.save();
    } else {
      taxRecord = new Tax({
        property_id: id,
        tax_amount: fullQuarterTax,
      });
      await taxRecord.save();
    }

    // -- HERE IS THE NEW PART --

    // 1. Delete all old tax collections for this property (clean slate)
    await TaxCollection.deleteMany({ property_id: id });

    // 2. Generate all quarters from the new registerDate to today
    const now = new Date();
    const quarters = getAllQuartersBetween(registerDate, now);

    const totalUnpaidQuarters = quarters.length;
    const earliestDueDate = totalUnpaidQuarters > 0 ? quarters[0].dueDate : null;
    const latestDueDate = totalUnpaidQuarters > 0 ? quarters[totalUnpaidQuarters - 1].dueDate : null;

    let totalDueSum = 0;
    let isFirstQuarter = true;
    const taxCollections = [];

    // 3. Create new tax collections for ALL quarters based on the updated registerDate
    for (const { quarter, dueDate } of quarters) {
      const quarterLastMonth = dueDate.getMonth() + 1; // 1-12
      const currentMonth = now.getMonth() + 1;

      let amountDue = 0;

      // Do not charge in the last month of the quarter (payment due month)
      if (currentMonth === quarterLastMonth) {
        amountDue = 0;
      } else {
        if (isFirstQuarter) {
          if (registerDate <= dueDate && now >= dueDate) {
            const registerMonth = registerDate.getMonth() + 1;
            const quarterStartMonth = quarterLastMonth - 2;
            const monthsPassedInQuarter = registerMonth - quarterStartMonth + 1;

            if (monthsPassedInQuarter === 1) amountDue = fullQuarterTax;
            else if (monthsPassedInQuarter === 2) amountDue = houseRent * 2 * 0.05;
            else if (monthsPassedInQuarter === 3) amountDue = houseRent * 1 * 0.05;
            else amountDue = fullQuarterTax;
          } else {
            amountDue = 0;
          }
        } else {
          amountDue = now >= dueDate ? fullQuarterTax : 0;
        }
      }

      if (amountDue > 0) {
        totalDueSum += amountDue;
      }

      const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${totalDueSum.toFixed(2)}`;

      const newTaxCollection = new TaxCollection({
        citizen_id: updatedProperty.citizen_id,
        property_id: id,
        tax_id: taxRecord._id,
        quarter,
        register_date: registerDate,
        due_date: dueDate,
        amount_due: amountDue,
        amount_paid: 0,
        status: amountDue === 0 ? 'paid' : 'due',
        total_unpaid_quarters: totalUnpaidQuarters,
        amount_per_quarter: fullQuarterTax,
        total_due: totalDueSum,
        earliest_due_date: earliestDueDate,
        latest_due_date: latestDueDate,
        message,
        property_register_date: registerDate,
      });

      await newTaxCollection.save();
      taxCollections.push(newTaxCollection);

      isFirstQuarter = false;
    }

    return res.status(200).json({ property: updatedProperty, taxCollections });

  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ message: 'Error updating property', error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Optionally delete related tax and tax collections
    await Tax.deleteMany({ property_id: id });
    await TaxCollection.deleteMany({ property_id: id });

    res.status(200).json({ message: 'Property and related records deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};

// New controller function to get property info by house number
exports.getPropertyByHouseNo = async (req, res) => {
  try {
    const houseNo = req.params.houseNo;

    const property = await Property.findOne({ house_no: houseNo })
    .populate('citizen_id', 'name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const tax = await Tax.findOne({ property_id: property._id });

    res.json({
      citizen_id: property.citizen_id?._id,
      citizen_name: property.citizen_id?.name,
      phone_number: property.citizen_id?.phone_number,
      district: property.district_id?.district_name,
      branch: property.branch_id?.branch_name,
      zone: property.zone_id?.zone_name,
      house_no: property.house_no,
      house_rent: property.house_rent.toString(),
      tax_amount: tax ? tax.tax_amount.toString() : '0',
      total_amount: tax ? (parseFloat(tax.tax_amount.toString()) + parseFloat(property.house_rent)).toString() : property.house_rent.toString(),
      property_id: property._id,
    });
  } catch (error) {
    console.error('Error fetching property by house no:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// In propertyController.js
exports.getPropertyByHouseNoForCitizen = async (req, res) => {
  try {
    const { houseNo, citizenId } = req.params;

    const property = await Property.findOne({ house_no: houseNo })
      .populate('citizen_id', '_id name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if citizen_id matches
    if (property.citizen_id._id.toString() !== citizenId) {
      return res.status(403).json({ message: 'Access denied: You do not own this house' });
    }

    const tax = await Tax.findOne({ property_id: property._id });

    res.json({
      citizen_id: property.citizen_id?._id,
      citizen_name: property.citizen_id?.name,
      phone_number: property.citizen_id?.phone_number,
      district: property.district_id?.district_name,
      branch: property.branch_id?.branch_name,
      zone: property.zone_id?.zone_name,
      house_no: property.house_no,
      house_rent: property.house_rent.toString(),
      tax_amount: tax ? tax.tax_amount.toString() : '0',
      total_amount_due: tax ? (parseFloat(tax.tax_amount.toString()) + parseFloat(property.house_rent)).toString() : property.house_rent.toString(),
      property_id: property._id,
    });
  } catch (error) {
    console.error('Error fetching property by house no:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get property by citizenId (assuming one property per citizen for simplicity)
exports.getPropertyByCitizenId = async (req, res) => {
  try {
    const { citizenId } = req.params;

    const property = await Property.findOne({ citizen_id: citizenId })
      .populate('citizen_id', 'name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    if (!property) {
      return res.status(404).json({ message: 'Property not found for citizen' });
    }

    const tax = await Tax.findOne({ property_id: property._id });

    res.json({
      house_no: property.house_no,
      district: property.district_id?.district_name,
      branch: property.branch_id?.branch_name,
      zone: property.zone_id?.zone_name,
      house_rent: property.house_rent.toString(),
      tax_amount: tax ? tax.tax_amount.toString() : '0',
      total_amount_due: tax ? (parseFloat(tax.tax_amount.toString()) + parseFloat(property.house_rent)).toString() : property.house_rent.toString(),
      property_id: property._id,
      citizen_id: property.citizen_id?._id,
      citizen_name: property.citizen_id?.name,
      phone_number: property.citizen_id?.phone_number, // <-- THIS IS CORRECT
    });
  } catch (error) {
    console.error('Error fetching property for citizen:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// exports.getPropertyByCitizenId = async (req, res) => {
//   try {
//     const citizenId = req.params.citizenId;
//     const property = await Property.findOne({ citizen_id: citizenId });
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found for this citizen' });
//     }
//     res.json(property);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// exports.togglePropertyStatus = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const property = await Property.findById(id);
//     if (!property) return res.status(404).json({ message: "Property not found" });

//     const now = new Date();

//     // Determine new status (toggle)
//     const newStatus = property.status === "active" ? "inactive" : "active";

//     let updateFields = { status: newStatus };

//     if (newStatus === "inactive") {
//       updateFields.inactivation_date = now;
    
//       const currentDay = now.getDate();
//       const currentMonth = now.getMonth() + 1; // 1-12
//       const quarterRanges = {
//         Q1: [1, 2, 3],
//         Q2: [4, 5, 6],
//         Q3: [7, 8, 9],
//         Q4: [10, 11, 12],
//       };
    
//       // Find the quarter of today
//       let currentQuarterKey = null;
//       for (const [key, months] of Object.entries(quarterRanges)) {
//         if (months.includes(currentMonth)) {
//           currentQuarterKey = key;
//           break;
//         }
//       }
//       const monthIndexInQuarter = quarterRanges[currentQuarterKey].indexOf(currentMonth);

//       // Find the current quarter's tax collection for this property
//       const currentQuarterTax = await TaxCollection.findOne({
//         property_id: id,
//         quarter: currentQuarterKey,
//         year: now.getFullYear(),
//       });
//       if (!currentQuarterTax) {
//         return res.status(404).json({ message: "Current quarter tax collection not found." });
//       }

//       // Calculate prorated or full amount based on inactivation timing
//       let proratedAmount = 0;
//       if (monthIndexInQuarter === 0) {
//         // First month: prorate for 1 month
//         proratedAmount = currentQuarterTax.amount_due / 3;
//       } else if ((monthIndexInQuarter === 1 || monthIndexInQuarter === 2) && currentDay <= 5) {
//         // 2nd or 3rd month, within first 5 days: prorate for months up to now
//         proratedAmount = (currentQuarterTax.amount_due / 3) * (monthIndexInQuarter + 1);
//       } else {
//         // After 5th day of 2nd or 3rd month: charge full quarter
//         proratedAmount = currentQuarterTax.amount_due;
//       }

//       // Set the amount for current quarter tax
//       currentQuarterTax.amount_due = proratedAmount;
//       currentQuarterTax.amount_paid = 0;
//       currentQuarterTax.status = 'due';
//       currentQuarterTax.total_due = proratedAmount;

//       await currentQuarterTax.save();
    
//       // Pause all other future tax collections
//       await TaxCollection.updateMany(
//         {
//           property_id: id,
//           _id: { $ne: currentQuarterTax._id },
//           status: { $in: ["due", "partial"] },
//           due_date: { $gte: now },
//         },
//         { $set: { status: "paused" } }
//       );
    
//     } else {
//       // Active now
//       updateFields.activation_date = now;
    
//       // Delete paused tax collections before activation date
//       await TaxCollection.deleteMany({
//         property_id: id,
//         status: "paused",
//         due_date: { $lt: updateFields.activation_date },
//       });
    
//       // Resume paused tax collections on or after activation date
//       await TaxCollection.updateMany(
//         {
//           property_id: id,
//           status: "paused",
//           due_date: { $gte: updateFields.activation_date },
//         },
//         { $set: { status: "due" } }
//       );
//     }

//     // Update property status and date fields
//     const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, {
//       new: true,
//     });

//     return res.status(200).json({
//       message: `Property marked as ${newStatus}`,
//       property: updatedProperty,
//     });
//   } catch (error) {
//     console.error("Error toggling property status:", error);
//     return res.status(500).json({
//       message: "Error toggling property status",
//       error: error.message,
//     });
//   }
// };












exports.togglePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const now = new Date();
    const newStatus = property.status === "active" ? "inactive" : "active";
    let updateFields = { status: newStatus };

    if (newStatus === "inactive") {
      updateFields.inactivation_date = now;
    
      const currentDay = now.getDate();
      const currentMonth = now.getMonth() + 1;
      const quarterRanges = {
        Q1: [1, 2, 3], Q2: [4, 5, 6], Q3: [7, 8, 9], Q4: [10, 11, 12],
      };
    
      const currentQuarterKey = Object.keys(quarterRanges).find(key => quarterRanges[key].includes(currentMonth));
      
      // Attempt to find the tax collection for the current quarter
      const currentQuarterTax = await TaxCollection.findOne({
        property_id: id,
        quarter: currentQuarterKey,
        year: now.getFullYear(),
      });

      // Prepare a query to find future tax collections to pause
      const futureTaxQuery = {
        property_id: id,
        status: { $in: ["due"] },
        due_date: { $gte: now },
      };

      // Only perform tax calculations if the current quarter's tax record exists
      if (currentQuarterTax) {
        const monthIndexInQuarter = quarterRanges[currentQuarterKey].indexOf(currentMonth);

        let proratedAmount = 0;
        if (monthIndexInQuarter === 0) { // First month
          proratedAmount = currentQuarterTax.amount_due / 3;
        } else if ((monthIndexInQuarter === 1 || monthIndexInQuarter === 2) && currentDay <= 5) { // 2nd/3rd month, before 5th day
          proratedAmount = (currentQuarterTax.amount_due / 3) * (monthIndexInQuarter + 1);
        } else { // After 5th day of 2nd/3rd month
          proratedAmount = currentQuarterTax.amount_due;
        }
        
        // Update the current quarter's tax
        currentQuarterTax.amount_due = proratedAmount;
        currentQuarterTax.amount_paid = 0;
        currentQuarterTax.status = 'due';
        currentQuarterTax.total_due = proratedAmount;
        await currentQuarterTax.save();
        
        // Exclude the current tax record from being paused
        futureTaxQuery._id = { $ne: currentQuarterTax._id };
      }
      
      // Pause all other future tax collections
      await TaxCollection.updateMany(futureTaxQuery, { $set: { status: "paused" } });
    
    } else { // If activating the property
      updateFields.activation_date = now;
    
      // Delete any "paused" tax records that are now in the past
      await TaxCollection.deleteMany({
        property_id: id,
        status: "paused",
        due_date: { $lt: updateFields.activation_date },
      });
    
      // Resume any "paused" tax records from this date forward
      await TaxCollection.updateMany(
        {
          property_id: id,
          status: "paused",
          due_date: { $gte: updateFields.activation_date },
        },
        { $set: { status: "due" } }
      );
    }

    // Finally, update the property's status
    const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, { new: true });

    return res.status(200).json({
      message: `Property successfully marked as ${newStatus}`,
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error toggling property status:", error);
    return res.status(500).json({
      message: "Error toggling property status",
      error: error.message,
    });
  }
};

const createPrefix = (name = '') => {
  if (!name) return 'XXX';
  return name.toUpperCase().replace(/(.)\1+/g, '$1').substring(0, 3);
};

// Replace your old getNextHouseNumber function with this one
exports.getNextHouseNumber = async (req, res) => {
  const { districtId, branchId } = req.query;

  // Log the incoming request
  console.log(`Request received for next house number with District: ${districtId}, Branch: ${branchId}`);

  if (!districtId || !branchId) {
    console.error("Validation Error: Missing districtId or branchId from request.");
    return res.status(400).json({ message: 'District ID and Branch ID are required.' });
  }

  try {
    const district = await District.findById(districtId);
    if (!district) {
      console.error(`Not Found Error: No district found with ID: ${districtId}`);
      return res.status(404).json({ message: 'District not found.' });
    }

    const branch = await Branch.findById(branchId);
    if (!branch) {
      console.error(`Not Found Error: No branch found with ID: ${branchId}`);
      return res.status(404).json({ message: 'Branch not found.' });
    }

    // This handles cases where the name field might be 'name' or 'district_name'
    const districtName = district.district_name || district.name;
    const branchName = branch.branch_name || branch.name;

    if (!districtName || !branchName) {
        console.error("Data Configuration Error: The 'district_name' or 'branch_name' field is missing from the database documents.", { district, branch });
        return res.status(500).json({ message: "Server data configuration error."});
    }

    const districtPrefix = createPrefix(districtName);
    const branchPrefix = createPrefix(branchName);
    const fullPrefix = `${districtPrefix}-${branchPrefix}`;

    console.log(`Generated prefix: ${fullPrefix}`);

    const lastProperty = await Property
      .findOne({ house_no: { $regex: `^${fullPrefix}-` } })
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastProperty && lastProperty.house_no) {
      const lastNumberStr = lastProperty.house_no.split('-').pop();
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const generatedHouseNo = `${fullPrefix}-${nextNumber}`;
    console.log(`Successfully generated house number: ${generatedHouseNo}`);

    res.status(200).json({ house_no: generatedHouseNo });

  } catch (error) {
    console.error('SERVER ERROR while generating house number:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.', error: error.message });
  }
};



exports.getTotalHouseRentForZone = async (req, res) => {
  try {
    const { zone_id } = req.query;

    if (!zone_id) {
      return res.status(400).json({ message: "Zone ID is required" });
    }

    // Find all properties in the selected zone
    const properties = await Property.find({ zone_id: zone_id }).select('house_rent');
    
    // Calculate the total rent for all properties in the zone
    const totalRent = properties.reduce((sum, property) => {
      return sum + (parseFloat(property.house_rent) || 0);
    }, 0);

    res.json({ totalRent });
  } catch (error) {
    console.error("Error fetching total house rent for zone:", error);
    res.status(500).json({ 
      message: "Error fetching total house rent", 
      error: error.message 
    });
  }
};