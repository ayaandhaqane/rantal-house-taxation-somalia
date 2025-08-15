const Citizen = require("../models/Citizen");
const Property = require("../models/Property"); // Adjust the path to your Property model
const Tax = require("../models/Tax");

// Helper function to generate random 6-digit numeric password
function generateRandomPassword() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register a new citizen
exports.createCitizen = async (req, res) => {
  const { name, phone_number, status, createdById } = req.body;  // Include createdById for user role

  try {
    const existingCitizen = await Citizen.findOne({ phone_number });
    if (existingCitizen) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const password = generateRandomPassword();

    const newCitizen = new Citizen({
      name,
      phone_number,
      password,
      status: status.toLowerCase(),
      activation_date: new Date(),
      inactivation_date: null,
      createdBy: createdById || "admin",  // Set createdById based on role or default to admin
    });
  

    await newCitizen.save();

    res.status(201).json({
      citizen: newCitizen,
      generatedPassword: password,
    });
  } catch (err) {
    console.error("Create citizen error:", err); // <-- add this line
    res.status(500).json({ message: "Error registering citizen", error: err.message });
  }
};


// Get all citizens
exports.getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find();
    res.status(200).json(citizens);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching citizens", error: err.message });
  }
};



// In: controllers/citizenController.js

// Add this entire new function to your controller file.
// It is specifically for the citizen management page.
exports.getManagedCitizenList = async (req, res) => {
  try {
    const query = {};
    // If the logged-in user is NOT an admin, filter by their own ID.
    if (req.user.role !== 'admin') {
      query.createdBy = req.user.id;
    }

    // Find citizens based on the query and populate the creator's info
    const citizens = await Citizen.find(query)
      .populate({
        path: 'createdBy',
        // This is the crucial part: it fetches the role and custom userId
        select: 'role userId'
      })
      .sort({ createdAt: -1 }); // Show newest first

    res.json(citizens);
  } catch (err) {
    console.error("Error in getManagedCitizenList:", err);
    res.status(500).json({ message: "Error fetching managed citizen list", error: err.message });
  }
};



// Update a citizen by ID
exports.updateCitizen = async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, status, activation_date, inactivation_date } =
    req.body;

  try {
    // Check if updating phone_number to an existing one
    const existing = await Citizen.findOne({ phone_number, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({
        message: "Phone number already registered to another citizen",
      });
    }

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      id,
      {
        name,
        phone_number,
        status,
        activation_date, // Add this line
        inactivation_date, // Add this line
      },
      { new: true, runValidators: true }
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.status(200).json(updatedCitizen);
  } catch (err) {
    console.error("Update citizen error:", err); // log actual error here
    res
      .status(500)
      .json({ message: "Error updating citizen", error: err.message });
  }
};

// Delete a citizen by ID
exports.deleteCitizen = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCitizen = await Citizen.findByIdAndDelete(id);

    if (!deletedCitizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.status(200).json({ message: "Citizen deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting citizen", error: err.message });
  }
};

// Login a citizen (add this to citizenController.js)
exports.loginCitizen = async (req, res) => {
  const { house_no, password } = req.body;

  try {
    // Find property by house number
    const property = await Property.findOne({ house_no });
    if (!property)
      return res.status(400).json({ message: "House number not found" });

    // Find citizen linked to the property
    const citizen = await Citizen.findById(property.citizen_id);
    if (!citizen)
      return res
        .status(400)
        .json({ message: "Citizen not found for this house number" });

    // Check password
    if (citizen.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    // Find tax for the property
    const tax = await Tax.findOne({ property_id: property._id });
    const tax_amount = tax ? tax.tax_amount : 0;

    return res.json({
      citizen,
      tax_amount,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getCitizenBasicProfile = async (req, res) => {
  const { id } = req.params; // citizen ID

  try {
    const citizen = await Citizen.findById(id).select(
      "name phone_number profile_image"
    );
    if (!citizen) return res.status(404).json({ message: "Citizen not found" });

    let property = await Property.findOne({ citizen_id: id }).select(
      "house_no district_id"
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    property = await property.populate("district_id", "district_name");
    // console.log(citizen);
    const baseURL = "https://rantal-house-taxation-somalia.onrender.com/";
    const filePath = citizen?.profile_image ?? "";

    // Replace backslashes with forward slashes to form a valid URL
    const fullURL = baseURL + filePath;
    return res.json({
      name: citizen.name,
      phone_number: citizen.phone_number, // Note the key here
      house_no: property.house_no, // Note the key here
      district: property.district_id
        ? property.district_id.district_name
        : null,
      profile_image: fullURL,
    });
  } catch (error) {
    console.error("Error fetching basic profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all citizens by district via properties - returns citizens linked to properties in the district
// exports.getCitizensByDistrict = async (req, res) => {
//   try {
//     const { districtId } = req.query;
//     if (!districtId) {
//       return res.status(400).json({ message: "DistrictId is required" });
//     }

//     // Find properties in the district and populate citizen info
//     const properties = await Property.find({ district_id: districtId })
//       .populate("citizen_id")
//       .lean();

//     // Extract citizens from properties that have one linked
//     const citizens = properties
//       .map((p) => p.citizen_id)
//       .filter((citizen) => citizen !== null && citizen !== undefined);

//     res.status(200).json(citizens);
//   } catch (err) {
//     console.error("Error fetching citizens by district:", err);
//     res.status(500).json({
//       message: "Error fetching citizens by district",
//       error: err.message,
//     });
//   }
// };
// In your auth middleware, set req.user.district from the JWT
exports.getCitizensByOwnDistrict = async (req, res) => {
  try {
    const userDistrictId = req.user.district;
    if (!userDistrictId) {
      return res.status(400).json({ message: "User district not found" });
    }

    const properties = await Property.find({ district_id: userDistrictId })
      .populate("citizen_id")
      .lean();

    const citizens = properties
      .map((p) => p.citizen_id)
      .filter((citizen) => citizen !== null && citizen !== undefined);

    res.status(200).json(citizens);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching citizens by district",
      error: err.message,
    });
  }
};


// In controllers/citizenController.js or propertyController.js

// Get property info for a citizen, including zone, district, branch
exports.getPropertyByCitizenId = async (req, res) => {
  const { citizenId } = req.params;

  try {
    // Find the property for this citizen
    let property = await Property.findOne({ citizen_id: citizenId })
      .populate("district_id", "district_name")
      .populate("branch_id", "branch_name")
      .populate("zone_id", "zone_name");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Return property info with populated fields
    res.json({
      house_no: property.house_no,
      house_rent: property.house_rent,
      district: property.district_id ? property.district_id.district_name : null,
      branch: property.branch_id ? property.branch_id.branch_name : null,
      zone: property.zone_id ? property.zone_id.zone_name : null,
      // ...add other fields as needed
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching property", error: err.message });
  }
};






// Add this to your citizenController.js or equivalent file

// Endpoint to get the count of citizens based on the selected district
exports.getCitizenCountByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).json({ message: "District is required" });
    }

    // Count citizens based on the selected district
    const citizensCount = await Citizen.countDocuments({ district });

    res.status(200).json({
      count: citizensCount,
    });
  } catch (err) {
    console.error("Error fetching citizen count by district:", err);
    res.status(500).json({ message: "Error fetching citizen count", error: err.message });
  }
};



// Add this to citizenController.js
exports.getCitizenReport = async (req, res) => {
  try {
    const { district, branch, zone } = req.query;
    
    // Build the query based on filters
    let propertyQuery = {};
    if (district) propertyQuery.district_id = district;
    if (branch) propertyQuery.branch_id = branch;
    if (zone) propertyQuery.zone_id = zone;

    // Get all properties matching the filters
    const properties = await Property.find(propertyQuery)
      .populate('citizen_id')
      .populate('district_id', 'district_name')
      .populate('branch_id', 'branch_name')
      .populate('zone_id', 'zone_name');

    // Extract citizens from properties
    const citizens = properties
      .map(p => p.citizen_id)
      .filter(c => c !== null && c !== undefined);

    // Get counts
    const totalCitizens = citizens.length;
    const activeCitizens = citizens.filter(c => c.status === 'active').length;
    const inactiveCitizens = totalCitizens - activeCitizens;
    const pendingCitizens = await Citizen.countDocuments({ status: 'pending' });

    // Get new registrations from last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const newRegistrations = await Citizen.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    // Get previous month data for comparison
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const prevMonthRegistrations = await Citizen.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo }
    });

    // Calculate percentage changes
    const registrationChange = prevMonthRegistrations > 0 
      ? ((newRegistrations - prevMonthRegistrations) / prevMonthRegistrations) * 100 
      : 0;

    const prevMonthPending = await Citizen.countDocuments({ 
      status: 'pending',
      createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo }
    });

    const pendingChange = prevMonthPending > 0 
      ? ((pendingCitizens - prevMonthPending) / prevMonthPending) * 100 
      : 0;

    // Group by district for the chart
    const districtDistribution = await Property.aggregate([
      { $match: propertyQuery },
      { $group: { 
        _id: '$district_id', 
        count: { $sum: 1 },
        districtName: { $first: '$district_id' } 
      }},
      { $lookup: {
        from: 'districts',
        localField: '_id',
        foreignField: '_id',
        as: 'district'
      }},
      { $unwind: '$district' },
      { $project: {
        district: '$district.district_name',
        count: 1
      }}
    ]);

    // Time series data for growth trend
    const timeSeriesData = await Citizen.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { 
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      summary: {
        totalCitizens,
        activeCitizens,
        inactiveCitizens,
        newRegistrations,
        registrationChange,
        pendingCitizens,
        pendingChange
      },
      districtDistribution,
      timeSeriesData,
      citizens: citizens.map(c => ({
        id: c._id,
        name: c.name,
        phone: c.phone_number,
        status: c.status,
        district: properties.find(p => p.citizen_id.equals(c._id))?.district_id?.district_name,
        branch: properties.find(p => p.citizen_id.equals(c._id))?.branch_id?.branch_name,
        zone: properties.find(p => p.citizen_id.equals(c._id))?.zone_id?.zone_name
      }))
    });

  } catch (err) {
    console.error("Error generating citizen report:", err);
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};



// Get citizens by district
exports.getCitizensByDistrict = async (req, res) => {
  try {
    const { districtId } = req.query; // Get districtId from query parameters
    if (!districtId) {
      return res.status(400).json({ message: "DistrictId is required" });
    }

    // Find properties in the district and populate citizen info
    const properties = await Property.find({ district_id: districtId })
      .populate("citizen_id")
      .lean();

    // Extract citizens from properties that have one linked
    const citizens = properties
      .map((p) => p.citizen_id)
      .filter((citizen) => citizen !== null && citizen !== undefined);

    res.status(200).json(citizens);
  } catch (err) {
    console.error("Error fetching citizens by district:", err);
    res.status(500).json({
      message: "Error fetching citizens by district",
      error: err.message,
    });
  }
};
