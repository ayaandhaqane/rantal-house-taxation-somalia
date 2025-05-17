// // const Property = require('../models/Property');

// // // Create a new property
// // exports.createProperty = async (req, res) => {
// //   const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, tax } = req.body;

// //   try {
// //     // Create a new Property instance
// //     const newProperty = new Property({
// //       citizen_id,
// //       house_no,
// //       district_id,
// //       branch_id,
// //       zone_id,
// //       house_rent,
// //       tax,
// //     });

// //     // Save the property to the database
// //     await newProperty.save();
// //     res.status(201).json(newProperty);  // Respond with the created property
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error creating property', error: err.message });
// //   }
// // };

// // // Get all properties
// // exports.getAllProperties = async (req, res) => {
// //   try {
// //     const properties = await Property.find().populate('citizen_id district_id branch_id zone_id');
// //     res.status(200).json(properties);  // Respond with the list of properties
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching properties', error: err.message });
// //   }
// // };

// // // Get property by ID
// // exports.getPropertyById = async (req, res) => {
// //   try {
// //     const property = await Property.findById(req.params.id).populate('citizen_id district_id branch_id zone_id');

// //     if (!property) {
// //       return res.status(404).json({ message: 'Property not found' });
// //     }

// //     res.status(200).json(property);  // Respond with the property details
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching property', error: err.message });
// //   }
// // };




// const Property = require('../models/Property');

// // Create property
// exports.createProperty = async (req, res) => {
//   try {
//     const {
//       citizen_id,
//       house_no,
//       district_id,
//       branch_id,
//       zone_id,
//       house_rent,
//       tax,
//       register_date,
//     } = req.body;

//     const property = new Property({
//       citizen_id,
//       house_no,
//       district_id,
//       branch_id,
//       zone_id,
//       house_rent,
//       tax,
//       register_date,
//     });

//     await property.save();
//     res.status(201).json(property);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating property', error: error.message });
//   }
// };

// // Get all properties with populated refs
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

// // Get property by ID
// exports.getPropertyById = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id)
//       .populate('citizen_id', 'name phone_number')
//       .populate('district_id', 'district_name')
//       .populate('branch_id', 'branch_name')
//       .populate('zone_id', 'zone_name');

//     if (!property) return res.status(404).json({ message: 'Property not found' });

//     res.status(200).json(property);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching property', error: error.message });
//   }
// };

// // Update property
// exports.updateProperty = async (req, res) => {
//   try {
//     const updatedProperty = await Property.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });

//     res.status(200).json(updatedProperty);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating property', error: error.message });
//   }
// };

// // Delete property
// exports.deleteProperty = async (req, res) => {
//   try {
//     const deleted = await Property.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Property not found' });
//     res.status(200).json({ message: 'Property deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting property', error: error.message });
//   }
// };







const Property = require('../models/Property');
const Tax = require('../models/Tax');

// Create property and calculate/save tax
exports.createProperty = async (req, res) => {
  try {
    const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent } = req.body;

    if (!house_rent) {
      return res.status(400).json({ message: "house_rent is required" });
    }

    const newProperty = new Property({
      citizen_id,
      house_no,
      district_id,
      branch_id,
      zone_id,
      house_rent,
      register_date: new Date(),
    });

    const savedProperty = await newProperty.save();

    const taxAmount = (parseFloat(house_rent) * 3) * 0.05;

    const newTax = new Tax({
      property_id: savedProperty._id,
      tax_amount: taxAmount,
    });

    await newTax.save();

    res.status(201).json({ property: savedProperty, tax: newTax });
  } catch (error) {
    console.error("Error creating property and tax:", error);
    res.status(500).json({ message: "Error creating property and tax", error: error.message });
  }
};

// Fetch properties with citizen info
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('citizen_id', 'name phone_number')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error: error.message });
  }
};

// Update property and update tax accordingly
exports.updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updateData = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const houseRent = Number(updatedProperty.house_rent);
    const newTaxAmount = houseRent * 3 * 0.05;

    let taxRecord = await Tax.findOne({ property_id: propertyId });

    if (taxRecord) {
      taxRecord.tax_amount = newTaxAmount;
      await taxRecord.save();
    } else {
      taxRecord = new Tax({
        property_id: propertyId,
        tax_amount: newTaxAmount,
      });
      await taxRecord.save();
    }

    res.status(200).json({ property: updatedProperty, tax: taxRecord });
  } catch (error) {
    console.error("Error updating property and tax:", error);
    res.status(500).json({ message: "Error updating property and tax", error: error.message });
  }
};
