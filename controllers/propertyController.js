// // // // const Property = require('../models/Property');

// // // // // Create a new property
// // // // exports.createProperty = async (req, res) => {
// // // //   const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, tax } = req.body;

// // // //   try {
// // // //     // Create a new Property instance
// // // //     const newProperty = new Property({
// // // //       citizen_id,
// // // //       house_no,
// // // //       district_id,
// // // //       branch_id,
// // // //       zone_id,
// // // //       house_rent,
// // // //       tax,
// // // //     });

// // // //     // Save the property to the database
// // // //     await newProperty.save();
// // // //     res.status(201).json(newProperty);  // Respond with the created property
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: 'Error creating property', error: err.message });
// // // //   }
// // // // };

// // // // // Get all properties
// // // // exports.getAllProperties = async (req, res) => {
// // // //   try {
// // // //     const properties = await Property.find().populate('citizen_id district_id branch_id zone_id');
// // // //     res.status(200).json(properties);  // Respond with the list of properties
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: 'Error fetching properties', error: err.message });
// // // //   }
// // // // };

// // // // // Get property by ID
// // // // exports.getPropertyById = async (req, res) => {
// // // //   try {
// // // //     const property = await Property.findById(req.params.id).populate('citizen_id district_id branch_id zone_id');

// // // //     if (!property) {
// // // //       return res.status(404).json({ message: 'Property not found' });
// // // //     }

// // // //     res.status(200).json(property);  // Respond with the property details
// // // //   } catch (err) {
// // // //     res.status(500).json({ message: 'Error fetching property', error: err.message });
// // // //   }
// // // // };




// // // const Property = require('../models/Property');

// // // // Create property
// // // exports.createProperty = async (req, res) => {
// // //   try {
// // //     const {
// // //       citizen_id,
// // //       house_no,
// // //       district_id,
// // //       branch_id,
// // //       zone_id,
// // //       house_rent,
// // //       tax,
// // //       register_date,
// // //     } = req.body;

// // //     const property = new Property({
// // //       citizen_id,
// // //       house_no,
// // //       district_id,
// // //       branch_id,
// // //       zone_id,
// // //       house_rent,
// // //       tax,
// // //       register_date,
// // //     });

// // //     await property.save();
// // //     res.status(201).json(property);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error creating property', error: error.message });
// // //   }
// // // };

// // // // Get all properties with populated refs
// // // exports.getAllProperties = async (req, res) => {
// // //   try {
// // //     const properties = await Property.find()
// // //       .populate('citizen_id', 'name phone_number')
// // //       .populate('district_id', 'district_name')
// // //       .populate('branch_id', 'branch_name')
// // //       .populate('zone_id', 'zone_name');
// // //     res.status(200).json(properties);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error fetching properties', error: error.message });
// // //   }
// // // };

// // // // Get property by ID
// // // exports.getPropertyById = async (req, res) => {
// // //   try {
// // //     const property = await Property.findById(req.params.id)
// // //       .populate('citizen_id', 'name phone_number')
// // //       .populate('district_id', 'district_name')
// // //       .populate('branch_id', 'branch_name')
// // //       .populate('zone_id', 'zone_name');

// // //     if (!property) return res.status(404).json({ message: 'Property not found' });

// // //     res.status(200).json(property);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error fetching property', error: error.message });
// // //   }
// // // };

// // // // Update property
// // // exports.updateProperty = async (req, res) => {
// // //   try {
// // //     const updatedProperty = await Property.findByIdAndUpdate(
// // //       req.params.id,
// // //       req.body,
// // //       { new: true, runValidators: true }
// // //     );

// // //     if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });

// // //     res.status(200).json(updatedProperty);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error updating property', error: error.message });
// // //   }
// // // };

// // // // Delete property
// // // exports.deleteProperty = async (req, res) => {
// // //   try {
// // //     const deleted = await Property.findByIdAndDelete(req.params.id);
// // //     if (!deleted) return res.status(404).json({ message: 'Property not found' });
// // //     res.status(200).json({ message: 'Property deleted successfully' });
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error deleting property', error: error.message });
// // //   }
// // // };







// // // const Property = require('../models/Property');
// // // const Tax = require('../models/Tax');

// // // // Create property and calculate/save tax
// // // exports.createProperty = async (req, res) => {
// // //   try {
// // //     const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent } = req.body;

// // //     if (!house_rent) {
// // //       return res.status(400).json({ message: "house_rent is required" });
// // //     }

// // //     const newProperty = new Property({
// // //       citizen_id,
// // //       house_no,
// // //       district_id,
// // //       branch_id,
// // //       zone_id,
// // //       house_rent,
// // //       register_date: new Date(),
// // //     });

// // //     const savedProperty = await newProperty.save();

// // //     const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

// // //     const newTax = new Tax({
// // //       property_id: savedProperty._id,
// // //       tax_amount: taxAmount,
// // //     });

// // //     await newTax.save();

// // //     res.status(201).json({ property: savedProperty, tax: newTax });
// // //   } catch (error) {
// // //     console.error("Error creating property and tax:", error);
// // //     res.status(500).json({ message: "Error creating property and tax", error: error.message });
// // //   }
// // // };

// // // // Fetch properties with citizen info
// // // exports.getAllProperties = async (req, res) => {
// // //   try {
// // //     const properties = await Property.find()
// // //       .populate('citizen_id', 'name phone_number')
// // //       .populate('district_id', 'district_name')
// // //       .populate('branch_id', 'branch_name')
// // //       .populate('zone_id', 'zone_name');

// // //     res.status(200).json(properties);
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error fetching properties", error: error.message });
// // //   }
// // // };

// // // // Update property and update tax accordingly
// // // exports.updateProperty = async (req, res) => {
// // //   try {
// // //     const propertyId = req.params.id;
// // //     const updateData = req.body;

// // //     const updatedProperty = await Property.findByIdAndUpdate(
// // //       propertyId,
// // //       updateData,
// // //       { new: true, runValidators: true }
// // //     );

// // //     if (!updatedProperty) {
// // //       return res.status(404).json({ message: 'Property not found' });
// // //     }

// // //     const houseRent = Number(updatedProperty.house_rent);
// // //     const newTaxAmount = houseRent * 3 * 0.05;

// // //     let taxRecord = await Tax.findOne({ property_id: propertyId });

// // //     if (taxRecord) {
// // //       taxRecord.tax_amount = newTaxAmount;
// // //       await taxRecord.save();
// // //     } else {
// // //       taxRecord = new Tax({
// // //         property_id: propertyId,
// // //         tax_amount: newTaxAmount,
// // //       });
// // //       await taxRecord.save();
// // //     }

// // //     res.status(200).json({ property: updatedProperty, tax: taxRecord });
// // //   } catch (error) {
// // //     console.error("Error updating property and tax:", error);
// // //     res.status(500).json({ message: "Error updating property and tax", error: error.message });
// // //   }
// // // };



// // // const Property = require('../models/Property');
// // // const Tax = require('../models/Tax');
// // // const TaxCollection = require('../models/TaxCollection');
// // // const { getQuarterInfo } = require('../utils/quarter.js');

// // // exports.createProperty = async (req, res) => {
// // //   try {
// // //     const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, register_date } = req.body;

// // //     // Use provided register_date or default to now
// // //     const propertyDate = register_date ? new Date(register_date) : new Date();

// // //     const newProperty = new Property({
// // //       citizen_id,
// // //       house_no,
// // //       district_id,
// // //       branch_id,
// // //       zone_id,
// // //       house_rent,
// // //       register_date: propertyDate,
// // //     });

// // //     const savedProperty = await newProperty.save();

// // //     // Calculate tax amount (3 months * 5%)
// // //     const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

// // //     const newTax = new Tax({
// // //       property_id: savedProperty._id,
// // //       tax_amount: taxAmount,
// // //     });

// // //     const savedTax = await newTax.save();

// // //     // Get quarter info for TaxCollection
// // //     const { quarter, dueDate } = getQuarterInfo(propertyDate);

// // //     // Create initial tax collection entry with status 'due'
// // //     const taxCollectionEntry = new TaxCollection({
// // //       citizen_id,
// // //       property_id: savedProperty._id,
// // //       tax_id: savedTax._id,
// // //       quarter,
// // //       due_date: dueDate,
// // //       amount_due: taxAmount,
// // //       status: 'due',
// // //     });

// // //     await taxCollectionEntry.save();

// // //     res.status(201).json({
// // //       property: savedProperty,
// // //       tax: savedTax,
// // //       taxCollection: taxCollectionEntry,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error creating property, tax, and tax collection:", error);
// // //     res.status(500).json({ message: "Error creating records", error: error.message });
// // //   }
// // // };

// // // exports.getAllProperties = async (req, res) => {
// // //   try {
// // //     const properties = await Property.find()
// // //       .populate('citizen_id', 'name phone_number')
// // //       .populate('district_id', 'district_name')
// // //       .populate('branch_id', 'branch_name')
// // //       .populate('zone_id', 'zone_name');

// // //     res.status(200).json(properties);
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error fetching properties", error: error.message });
// // //   }
// // // };

// // // exports.updateProperty = async (req, res) => {
// // //   try {
// // //     const propertyId = req.params.id;
// // //     const updateData = req.body;

// // //     // Update property
// // //     const updatedProperty = await Property.findByIdAndUpdate(
// // //       propertyId,
// // //       updateData,
// // //       { new: true, runValidators: true }
// // //     );

// // //     if (!updatedProperty) {
// // //       return res.status(404).json({ message: 'Property not found' });
// // //     }

// // //     // Calculate new tax amount
// // //     const houseRent = Number(updatedProperty.house_rent);
// // //     const newTaxAmount = houseRent * 3 * 0.05;

// // //     // Find existing tax record or create new
// // //     let taxRecord = await Tax.findOne({ property_id: propertyId });

// // //     if (taxRecord) {
// // //       taxRecord.tax_amount = newTaxAmount;
// // //       await taxRecord.save();
// // //     } else {
// // //       taxRecord = new Tax({
// // //         property_id: propertyId,
// // //         tax_amount: newTaxAmount,
// // //       });
// // //       await taxRecord.save();
// // //     }

// // //     // Update TaxCollection entries for this property
// // //     // Find all tax collections for this property with status 'due' or 'overdue'
// // //     const taxCollections = await TaxCollection.find({ property_id: propertyId, status: { $in: ['due', 'overdue'] } });

// // //     // Update amount_due for all due/overdue collections
// // //     for (const tc of taxCollections) {
// // //       tc.amount_due = newTaxAmount;
// // //       await tc.save();
// // //     }

// // //     res.status(200).json({ property: updatedProperty, tax: taxRecord, taxCollectionsUpdated: taxCollections.length });
// // //   } catch (error) {
// // //     console.error("Error updating property, tax, and tax collections:", error);
// // //     res.status(500).json({ message: "Error updating records", error: error.message });
// // //   }
// // // };








// // const Property = require('../models/Property');
// // const Tax = require('../models/Tax');
// // const TaxCollection = require('../models/TaxCollection');
// // const { getQuarterInfo } = require('../utils/quarter');

// // exports.createProperty = async (req, res) => {
// //   try {
// //     const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, register_date } = req.body;

// //     const propertyDate = register_date ? new Date(register_date) : new Date();

// //     const newProperty = new Property({
// //       citizen_id,
// //       house_no,
// //       district_id,
// //       branch_id,
// //       zone_id,
// //       house_rent,
// //       register_date: propertyDate,
// //     });

// //     const savedProperty = await newProperty.save();

// //     // Calculate tax amount (3 months * 5%)
// //     const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

// //     const newTax = new Tax({
// //       property_id: savedProperty._id,
// //       tax_amount: taxAmount,
// //     });

// //     const savedTax = await newTax.save();

// //     // Get quarter info for TaxCollection
// //     const { quarter, dueDate } = getQuarterInfo(propertyDate);

// //     // Create initial tax collection entry with status 'due'
// //     const taxCollectionEntry = new TaxCollection({
// //       citizen_id,
// //       property_id: savedProperty._id,
// //       tax_id: savedTax._id,
// //       quarter,
// //       due_date: dueDate,
// //       amount_due: taxAmount,
// //       status: 'due',
// //     });

// //     await taxCollectionEntry.save();

// //     res.status(201).json({
// //       property: savedProperty,
// //       tax: savedTax,
// //       taxCollection: taxCollectionEntry,
// //     });
// //   } catch (error) {
// //     console.error("Error creating property, tax, and tax collection:", error);
// //     res.status(500).json({ message: "Error creating records", error: error.message });
// //   }
// // };

// // exports.getAllProperties = async (req, res) => {
// //   try {
// //     const properties = await Property.find()
// //       .populate('citizen_id', 'name phone_number')
// //       .populate('district_id', 'district_name')
// //       .populate('branch_id', 'branch_name')
// //       .populate('zone_id', 'zone_name');

// //     res.status(200).json(properties);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching properties", error: error.message });
// //   }
// // };

// // exports.updateProperty = async (req, res) => {
// //   try {
// //     const propertyId = req.params.id;
// //     const updateData = req.body;

// //     // Update property
// //     const updatedProperty = await Property.findByIdAndUpdate(
// //       propertyId,
// //       updateData,
// //       { new: true, runValidators: true }
// //     );

// //     if (!updatedProperty) {
// //       return res.status(404).json({ message: 'Property not found' });
// //     }

// //     // Calculate new tax amount
// //     const houseRent = Number(updatedProperty.house_rent);
// //     const newTaxAmount = houseRent * 3 * 0.05;

// //     // Find existing tax record or create new
// //     let taxRecord = await Tax.findOne({ property_id: propertyId });

// //     if (taxRecord) {
// //       taxRecord.tax_amount = newTaxAmount;
// //       await taxRecord.save();
// //     } else {
// //       taxRecord = new Tax({
// //         property_id: propertyId,
// //         tax_amount: newTaxAmount,
// //       });
// //       await taxRecord.save();
// //     }

// //     // Update TaxCollection entries for this property
// //     // Find all tax collections for this property with status 'due' or 'overdue'
// //     const taxCollections = await TaxCollection.find({ property_id: propertyId, status: { $in: ['due', 'overdue'] } });

// //     // Update amount_due for all due/overdue collections
// //     for (const tc of taxCollections) {
// //       tc.amount_due = newTaxAmount;
// //       await tc.save();
// //     }

// //     res.status(200).json({ property: updatedProperty, tax: taxRecord, taxCollectionsUpdated: taxCollections.length });
// //   } catch (error) {
// //     console.error("Error updating property, tax, and tax collections:", error);
// //     res.status(500).json({ message: "Error updating records", error: error.message });
// //   }
// // };











// const Property = require('../models/Property');
// const Tax = require('../models/Tax');
// const TaxCollection = require('../models/TaxCollection');
// const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');

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

//     // Create tax collection entries for all quarters from register_date to now
//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     const taxCollections = [];
//     let totalUnpaidQuarters = 0;
//     let totalDue = 0;
//     let earliestDueDate = null;
//     let latestDueDate = null;

//     for (const { quarter, dueDate } of quarters) {
//       const existing = await TaxCollection.findOne({
//         citizen_id,
//         property_id: savedProperty._id,
//         quarter,
//       });

//       if (!existing) {
//         const taxCollectionEntry = new TaxCollection({
//           citizen_id,
//           property_id: savedProperty._id,
//           tax_id: savedTax._id,
//           quarter,
//           due_date: dueDate,
//           amount_due: taxAmount,
//           status: 'due',
//         });

//         await taxCollectionEntry.save();
//         taxCollections.push(taxCollectionEntry);

//         totalUnpaidQuarters++;
//         totalDue += taxAmount;

//         if (!earliestDueDate || dueDate < earliestDueDate) earliestDueDate = dueDate;
//         if (!latestDueDate || dueDate > latestDueDate) latestDueDate = dueDate;
//       }
//     }

//     const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${totalDue.toFixed(2)}`;

//     res.status(201).json({
//       property: savedProperty,
//       tax: savedTax,
//       taxSummary: {
//         citizen_id,
//         total_unpaid_quarters: totalUnpaidQuarters,
//         amount_per_quarter: taxAmount,
//         total_due: totalDue,
//         earliest_due_date: earliestDueDate,
//         latest_due_date: latestDueDate,
//         message,
//       },
//     });
//   } catch (error) {
//     console.error('Error creating property, tax, and tax collections:', error);
//     res.status(500).json({ message: 'Error creating records', error: error.message });
//   }
// };

// exports.getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find()
//       .populate('citizen_id', 'name phone_number')
//       .populate('district_id', 'district_name')
//       .populate('branch_id', 'branch_name')
//       .populate('zone_id', 'zone_name');

//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching properties', error: error.message });
//   }
// };

// exports.updateProperty = async (req, res) => {
//   try {
//     const propertyId = req.params.id;
//     const updateData = req.body;

//     const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedProperty) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     const houseRent = Number(updatedProperty.house_rent);
//     const newTaxAmount = houseRent * 3 * 0.05;

//     let taxRecord = await Tax.findOne({ property_id: propertyId });

//     if (taxRecord) {
//       taxRecord.tax_amount = newTaxAmount;
//       await taxRecord.save();
//     } else {
//       taxRecord = new Tax({
//         property_id: propertyId,
//         tax_amount: newTaxAmount,
//       });
//       await taxRecord.save();
//     }

//     const taxCollections = await TaxCollection.find({
//       property_id: propertyId,
//       status: { $in: ['due', 'overdue'] },
//     });

//     for (const tc of taxCollections) {
//       tc.amount_due = newTaxAmount;
//       await tc.save();
//     }

//     res.status(200).json({
//       property: updatedProperty,
//       tax: taxRecord,
//       taxCollectionsUpdated: taxCollections.length,
//     });
//   } catch (error) {
//     console.error('Error updating property, tax, and tax collections:', error);
//     res.status(500).json({ message: 'Error updating records', error: error.message });
//   }
// };



// controllers/propertyController.js

// const Property = require('../models/Property');
// const Tax = require('../models/Tax');
// const TaxCollection = require('../models/TaxCollection');
// const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');

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

//     const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

//     // Calculate adjusted tax for first quarter depending on month of registration
//     const month = propertyDate.getMonth() + 1; // 1-12
//     let adjustedTaxFirstQuarter = fullQuarterTax; // default full quarter tax

//     if ([4, 5, 6].includes(month)) { // quater 2: April=4, May=5, June=6
//       if (month === 4) { // April, full quarter
//         adjustedTaxFirstQuarter = fullQuarterTax;
//       } else if (month === 5) { // May, 2 months * rent * 5%
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       } else if (month === 6) { // June, 1 month * rent * 5%
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//       }
//     } else if ([1, 2, 3].includes(month)) { // quater 1: Jan, Feb, Mar - full quarter always
//       adjustedTaxFirstQuarter = fullQuarterTax;
//     } else if ([7, 8, 9].includes(month)) { // quater 3: Jul, Aug, Sep - same pattern
//       if (month === 7) {
//         adjustedTaxFirstQuarter = fullQuarterTax;
//       } else if (month === 8) {
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       } else if (month === 9) {
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//       }
//     } else if ([10, 11, 12].includes(month)) { // quater 4: Oct, Nov, Dec - same pattern
//       if (month === 10) {
//         adjustedTaxFirstQuarter = fullQuarterTax;
//       } else if (month === 11) {
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       } else if (month === 12) {
//         adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//       }
//     }

//     // Create tax record
//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: fullQuarterTax,
//     });
//     const savedTax = await newTax.save();

//     // Get all quarters from register_date to now
//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     const totalUnpaidQuarters = quarters.length;
//     const earliestDueDate = quarters.length > 0 ? quarters[0].dueDate : null;
//     const latestDueDate = quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null;

//     const taxCollections = [];
//     let isFirstQuarter = true;

//     for (const { quarter, dueDate } of quarters) {
//       const exists = await TaxCollection.findOne({
//         citizen_id,
//         property_id: savedProperty._id,
//         quarter,
//       });

//       if (!exists) {
//         const amountDue = isFirstQuarter ? adjustedTaxFirstQuarter : fullQuarterTax;

//         const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${(fullQuarterTax * totalUnpaidQuarters).toFixed(2)}`;

//         const newTaxCollection = new TaxCollection({
//           citizen_id,
//           property_id: savedProperty._id,
//           tax_id: savedTax._id,
//           quarter,
//           due_date: dueDate,
//           amount_due: amountDue,
//           status: 'due',

//           total_unpaid_quarters: totalUnpaidQuarters,
//           amount_per_quarter: fullQuarterTax,
//           total_due: fullQuarterTax * totalUnpaidQuarters,
//           earliest_due_date: earliestDueDate,
//           latest_due_date: latestDueDate,
//           message,
//         });

//         await newTaxCollection.save();
//         taxCollections.push(newTaxCollection);

//         isFirstQuarter = false;
//       }
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



// exports.getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find()
//       .populate('citizen_id', 'name phone_number')
//       .populate('district_id', 'district_name')
//       .populate('branch_id', 'branch_name')
//       .populate('zone_id', 'zone_name');

//     res.status(200).json(properties);
//   } catch (error) {
//     console.error('Error fetching properties:', error);
//     res.status(500).json({ message: 'Error fetching properties', error: error.message });
//   }
// };

// exports.getPropertyById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const property = await Property.findById(id)
//       .populate('citizen_id', 'name phone_number')
//       .populate('district_id', 'district_name')
//       .populate('branch_id', 'branch_name')
//       .populate('zone_id', 'zone_name');

//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     res.status(200).json(property);
//   } catch (error) {
//     console.error('Error fetching property:', error);
//     res.status(500).json({ message: 'Error fetching property', error: error.message });
//   }
// };

// exports.updateProperty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedProperty) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     // Update tax amount if house_rent changed
//     if (updateData.house_rent) {
//       const newTaxAmount = (parseFloat(updateData.house_rent) * 3) * 0.05;

//       let taxRecord = await Tax.findOne({ property_id: id });

//       if (taxRecord) {
//         taxRecord.tax_amount = newTaxAmount;
//         await taxRecord.save();
//       } else {
//         taxRecord = new Tax({
//           property_id: id,
//           tax_amount: newTaxAmount,
//         });
//         await taxRecord.save();
//       }

//       // Update amount_due in due or overdue tax collections
//       const taxCollections = await TaxCollection.find({
//         property_id: id,
//         status: { $in: ['due', 'overdue'] },
//       });

//       for (const tc of taxCollections) {
//         tc.amount_due = newTaxAmount;
//         await tc.save();
//       }
//     }

//     res.status(200).json({ property: updatedProperty });
//   } catch (error) {
//     console.error('Error updating property:', error);
//     res.status(500).json({ message: 'Error updating property', error: error.message });
//   }
// };

// exports.deleteProperty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Property.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     // Optionally delete related tax and tax collections
//     await Tax.deleteMany({ property_id: id });
//     await TaxCollection.deleteMany({ property_id: id });

//     res.status(200).json({ message: 'Property and related records deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting property:', error);
//     res.status(500).json({ message: 'Error deleting property', error: error.message });
//   }
// };









// const Property = require('../models/Property');
// const Tax = require('../models/Tax');
// const TaxCollection = require('../models/TaxCollection');
// const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');

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

//     const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

//     // --- NEW LOGIC: Calculate adjusted tax for first quarter depending on month of registration ---
//     const month = propertyDate.getMonth() + 1; // Month number 1-12
//     let adjustedTaxFirstQuarter = fullQuarterTax; // Default full quarter tax

//     if ([1, 2, 3].includes(month)) { // Q1 (Jan, Feb, Mar)
//       if (month === 1) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 2) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 3) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([4, 5, 6].includes(month)) { // Q2 (Apr, May, Jun)
//       if (month === 4) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 5) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 6) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([7, 8, 9].includes(month)) { // Q3 (Jul, Aug, Sep)
//       if (month === 7) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 8) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 9) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     } else if ([10, 11, 12].includes(month)) { // Q4 (Oct, Nov, Dec)
//       if (month === 10) adjustedTaxFirstQuarter = fullQuarterTax;
//       else if (month === 11) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
//       else if (month === 12) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
//     }
//     // --- END OF NEW LOGIC ---

//     // Create tax record with full quarter tax amount
//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: fullQuarterTax,
//     });
//     const savedTax = await newTax.save();

//     // Get all quarters from register date to now
//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     const totalUnpaidQuarters = quarters.length;
//     const earliestDueDate = quarters.length > 0 ? quarters[0].dueDate : null;
//     const latestDueDate = quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null;

//     const taxCollections = [];
//     let isFirstQuarter = true;

//     for (const { quarter, dueDate } of quarters) {
//       const exists = await TaxCollection.findOne({
//         citizen_id,
//         property_id: savedProperty._id,
//         quarter,
//       });

//       if (!exists) {
//         // Use adjusted tax only for the first quarter, full tax for others
//         const amountDue = isFirstQuarter ? adjustedTaxFirstQuarter : fullQuarterTax;

//         const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${(fullQuarterTax * totalUnpaidQuarters).toFixed(2)}`;

//         const newTaxCollection = new TaxCollection({
//           citizen_id,
//           property_id: savedProperty._id,
//           tax_id: savedTax._id,
//           quarter,
//           due_date: dueDate,
//           amount_due: amountDue,
//           amount_paid: 0,
//           status: 'due',

//           total_unpaid_quarters: totalUnpaidQuarters,
//           amount_per_quarter: fullQuarterTax,
//           total_due: fullQuarterTax * totalUnpaidQuarters,
//           earliest_due_date: earliestDueDate,
//           latest_due_date: latestDueDate,
//           message,
//         });

//         await newTaxCollection.save();
//         taxCollections.push(newTaxCollection);

//         isFirstQuarter = false;
//       }
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


// const Property = require('../models/Property');
// const Tax = require('../models/Tax');
// const TaxCollection = require('../models/TaxCollection');
// const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');

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

//     const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

//     // Calculate adjusted tax for first quarter depending on month of registration
//     const month = propertyDate.getMonth() + 1; // Month number 1-12
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

//     // Create tax record with full quarter tax amount
//     const newTax = new Tax({
//       property_id: savedProperty._id,
//       tax_amount: fullQuarterTax,
//     });
//     const savedTax = await newTax.save();

//     const now = new Date();
//     const quarters = getAllQuartersBetween(propertyDate, now);

//     const totalUnpaidQuarters = quarters.length;
//     const earliestDueDate = quarters.length > 0 ? quarters[0].dueDate : null;
//     const latestDueDate = quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null;

//     const taxCollections = [];
//     let isFirstQuarter = true;

//     for (const { quarter, dueDate } of quarters) {
//       // Check if tax collection for this quarter already exists
//       const exists = await TaxCollection.findOne({
//         citizen_id,
//         property_id: savedProperty._id,
//         quarter,
//       });

//       if (!exists) {
//         // For the current quarter, only charge tax if register_date <= due_date
//         let amountDue;
//         if (isFirstQuarter) {
//           if (propertyDate <= dueDate) {
//             amountDue = adjustedTaxFirstQuarter;
//           } else {
//             // If registered after due date of quarter, do not charge for this quarter
//             amountDue = 0;
//           }
//         } else {
//           amountDue = fullQuarterTax;
//         }

//         const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${(fullQuarterTax * totalUnpaidQuarters).toFixed(2)}`;

//         const newTaxCollection = new TaxCollection({
//           citizen_id,
//           property_id: savedProperty._id,
//           tax_id: savedTax._id,
//           quarter,
//           register_date,
//           due_date: dueDate,
//           amount_due: amountDue,
//           amount_paid: 0,
//           status: amountDue === 0 ? 'paid' : 'due', // mark as paid if no amount_due
//           total_unpaid_quarters: totalUnpaidQuarters,
//           amount_per_quarter: fullQuarterTax,
//           total_due: fullQuarterTax * totalUnpaidQuarters,
//           earliest_due_date: earliestDueDate,
//           latest_due_date: latestDueDate,
//           message,
//           property_register_date: propertyDate, // store property registration date here
//         });

//         await newTaxCollection.save();
//         taxCollections.push(newTaxCollection);

//         isFirstQuarter = false;
//       }
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


const Property = require('../models/Property');
const Tax = require('../models/Tax');
const TaxCollection = require('../models/TaxCollection');
const { getQuarterInfo, getAllQuartersBetween } = require('../utils/quarter');

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

    const fullQuarterTax = (parseFloat(house_rent) * 3) * 0.05;

    // Calculate adjusted tax for first quarter depending on month of registration
    const month = propertyDate.getMonth() + 1; // Month number 1-12
    let adjustedTaxFirstQuarter = fullQuarterTax;

    if ([1, 2, 3].includes(month)) {
      if (month === 1) adjustedTaxFirstQuarter = fullQuarterTax;
      else if (month === 2) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
      else if (month === 3) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
    } else if ([4, 5, 6].includes(month)) {
      if (month === 4) adjustedTaxFirstQuarter = fullQuarterTax;
      else if (month === 5) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
      else if (month === 6) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
    } else if ([7, 8, 9].includes(month)) {
      if (month === 7) adjustedTaxFirstQuarter = fullQuarterTax;
      else if (month === 8) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
      else if (month === 9) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
    } else if ([10, 11, 12].includes(month)) {
      if (month === 10) adjustedTaxFirstQuarter = fullQuarterTax;
      else if (month === 11) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 2) * 0.05;
      else if (month === 12) adjustedTaxFirstQuarter = (parseFloat(house_rent) * 1) * 0.05;
    }

    // Create tax record with full quarter tax amount
    const newTax = new Tax({
      property_id: savedProperty._id,
      tax_amount: fullQuarterTax,
    });
    const savedTax = await newTax.save();

    const now = new Date();
    const quarters = getAllQuartersBetween(propertyDate, now);

    const totalUnpaidQuarters = quarters.length;
    const earliestDueDate = quarters.length > 0 ? quarters[0].dueDate : null;
    const latestDueDate = quarters.length > 0 ? quarters[quarters.length - 1].dueDate : null;

    const taxCollections = [];
    let isFirstQuarter = true;

    for (const { quarter, dueDate } of quarters) {
      // Check if tax collection for this quarter already exists
      const exists = await TaxCollection.findOne({
        citizen_id,
        property_id: savedProperty._id,
        quarter,
      });

      if (!exists) {
        // Add logic: Only charge if current date >= quarter's due date
        const chargeNow = now >= dueDate;

        let amountDue;
        if (isFirstQuarter) {
          if (propertyDate <= dueDate && chargeNow) {
            amountDue = adjustedTaxFirstQuarter;
          } else {
            amountDue = 0; // no charge if not due yet or registered after due date
          }
        } else {
          amountDue = chargeNow ? fullQuarterTax : 0;
        }

        const message = `Total unpaid quarters: ${totalUnpaidQuarters}, total amount due: $${(fullQuarterTax * totalUnpaidQuarters).toFixed(2)}`;

        const newTaxCollection = new TaxCollection({
          citizen_id,
          property_id: savedProperty._id,
          tax_id: savedTax._id,
          quarter,
          register_date,
          due_date: dueDate,
          amount_due: amountDue,
          amount_paid: 0,
          status: amountDue === 0 ? 'paid' : 'due',
          total_unpaid_quarters: totalUnpaidQuarters,
          amount_per_quarter: fullQuarterTax,
          total_due: fullQuarterTax * totalUnpaidQuarters,
          earliest_due_date: earliestDueDate,
          latest_due_date: latestDueDate,
          message,
          property_register_date: propertyDate,
        });

        await newTaxCollection.save();
        taxCollections.push(newTaxCollection);

        isFirstQuarter = false;
      }
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

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update tax amount if house_rent changed
    if (updateData.house_rent) {
      const newTaxAmount = (parseFloat(updateData.house_rent) * 3) * 0.05;

      let taxRecord = await Tax.findOne({ property_id: id });

      if (taxRecord) {
        taxRecord.tax_amount = newTaxAmount;
        await taxRecord.save();
      } else {
        taxRecord = new Tax({
          property_id: id,
          tax_amount: newTaxAmount,
        });
        await taxRecord.save();
      }

      // Update amount_due in due or overdue tax collections
      const taxCollections = await TaxCollection.find({
        property_id: id,
        status: { $in: ['due', 'overdue'] },
      });

      for (const tc of taxCollections) {
        tc.amount_due = newTaxAmount;
        await tc.save();
      }
    }

    res.status(200).json({ property: updatedProperty });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property', error: error.message });
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
