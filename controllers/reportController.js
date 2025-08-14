const mongoose = require('mongoose');
const Citizen = require("../models/Citizen");
const Property = require("../models/Property");
const Branch = require('../models/Branch');
const Tax = require("../models/Tax");
const Complaint = require('../models/Complaint');
const Zone = require('../models/Zone');
const StatusChangeRequest = require("../models/StatusChangeRequest");

//Citizen report
// Get active citizens (citizens whose property is active)
exports.getActiveCitizens = async (req, res) => {
  try {
    const activeCitizens = await Citizen.aggregate([
      { 
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "citizen_id",
          as: "property"
        }
      },
      { $unwind: "$property" },
      { $match: { "property.status": "active" } }, // Match active properties
      { $count: "activeCitizens" } // Aggregate the count
    ]);

    res.status(200).json({ activeCitizens: activeCitizens.length > 0 ? activeCitizens[0].activeCitizens : 0 });
  } catch (error) {
    console.error("Error fetching active citizens:", error);
    res.status(500).json({ message: "Error fetching active citizens", error: error.message });
  }
};

// Get inactive citizens (citizens whose property is inactive)
exports.getInactiveCitizens = async (req, res) => {
  try {
    const inactiveCitizens = await Citizen.aggregate([
      { 
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "citizen_id",
          as: "property"
        }
      },
      { $unwind: "$property" },
      { $match: { "property.status": "inactive" } }, // Match inactive properties
      { $count: "inactiveCitizens" } // Aggregate the count
    ]);

    res.status(200).json({ inactiveCitizens: inactiveCitizens.length > 0 ? inactiveCitizens[0].inactiveCitizens : 0 });
  } catch (error) {
    console.error("Error fetching inactive citizens:", error);
    res.status(500).json({ message: "Error fetching inactive citizens", error: error.message });
  }
};

// Get pending citizens (whose property is pending)
exports.getPendingCitizens = async (req, res) => {
    try {
      const pendingCitizens = await Citizen.aggregate([
        { 
          $lookup: {
            from: "properties",
            localField: "_id",
            foreignField: "citizen_id",
            as: "property"
          }
        },
        { $unwind: "$property" },
        { $match: { "property.status": "pending" } }, // Match pending properties
        { $count: "pendingCitizens" }
      ]);
      res.status(200).json({ pendingCitizens: pendingCitizens.length > 0 ? pendingCitizens[0].pendingCitizens : 0 });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending citizens", error: error.message });
    }
  };

// Controller for fetching total citizens by district, branch, and zone
exports.getTotalCitizens = async (req, res) => {
    try {
        // Prepare the query object based on query parameters (district, branch, zone, status)
        const query = {};

        if (req.query.district) query.district_id = req.query.district;
        if (req.query.branch) query.branch_id = req.query.branch;
        if (req.query.zone) query.zone_id = req.query.zone;
        if (req.query.status) query.status = req.query.status;

        const totalCitizens = await Citizen.countDocuments(query);
        res.json({ totalCitizens });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total citizens", error: error.message });
    }
};

// Citizens filtered by current user's district
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

  // GET citizens by selected district (based on property linkage)
exports.getTotalCitizensByDistrict = async (req, res) => {
    try {
      const districtId = req.params.districtId;
  
      const properties = await Property.find({ district_id: districtId }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
  
      res.json({ totalCitizens: citizenIds.length });
    } catch (error) {
      console.error("Error fetching citizens by district:", error);
      res.status(500).json({ message: "Error fetching citizens by district", error: error.message });
    }
  };
  
  // Active Citizens By District
exports.getActiveCitizensByDistrict = async (req, res) => {
    try {
      const districtId = req.params.districtId;
      const properties = await Property.find({ district_id: districtId, status: 'active' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ activeCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching active citizens by district", error: error.message });
    }
  };
  
  // Inactive Citizens By District
  exports.getInactiveCitizensByDistrict = async (req, res) => {
    try {
      const districtId = req.params.districtId;
      const properties = await Property.find({ district_id: districtId, status: 'inactive' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ inactiveCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching inactive citizens by district", error: error.message });
    }
  };
    //   pending Citizens By District
  exports.getPendingCitizensByDistrict = async (req, res) => {
    try {
      const districtId = req.params.districtId;
      const properties = await Property.find({ district_id: districtId, status: 'pending' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ pendingCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending citizens by district", error: error.message });
    }
  };
  
  // Total Citizens by Branch
exports.getTotalCitizensByBranch = async (req, res) => {
    try {
      const branchId = req.params.branchId;
      const properties = await Property.find({ branch_id: branchId }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ totalCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching citizens by branch", error: error.message });
    }
  };
  
  // Active Citizens by Branch
  exports.getActiveCitizensByBranch = async (req, res) => {
    try {
      const branchId = req.params.branchId;
      const properties = await Property.find({ branch_id: branchId, status: 'active' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ activeCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching active citizens by branch", error: error.message });
    }
  };
  
  // Inactive Citizens by Branch
  exports.getInactiveCitizensByBranch = async (req, res) => {
    try {
      const branchId = req.params.branchId;
      const properties = await Property.find({ branch_id: branchId, status: 'inactive' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ inactiveCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching inactive citizens by branch", error: error.message });
    }
  };

  // pending Citizens by Branch
  exports.getPendingCitizensByBranch = async (req, res) => {
    try {
      const branchId = req.params.branchId;
      const properties = await Property.find({ branch_id: branchId, status: 'pending' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ pendingCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending citizens by branch", error: error.message });
    }
  };
  
  // Total Citizens by Zone
exports.getTotalCitizensByZone = async (req, res) => {
    try {
      const zoneId = req.params.zoneId;
      const properties = await Property.find({ zone_id: zoneId }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ totalCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching citizens by zone", error: error.message });
    }
  };
  
  // Active Citizens by Zone
  exports.getActiveCitizensByZone = async (req, res) => {
    try {
      const zoneId = req.params.zoneId;
      const properties = await Property.find({ zone_id: zoneId, status: 'active' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ activeCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching active citizens by zone", error: error.message });
    }
  };
  
  // Inactive Citizens by Zone
  exports.getInactiveCitizensByZone = async (req, res) => {
    try {
      const zoneId = req.params.zoneId;
      const properties = await Property.find({ zone_id: zoneId, status: 'inactive' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ inactiveCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching inactive citizens by zone", error: error.message });
    }
  };
  
  // pending Citizens by Zone
  exports.getPendingCitizensByZone = async (req, res) => {
    try {
      const zoneId = req.params.zoneId;
      const properties = await Property.find({ zone_id: zoneId, status: 'pending' }).select('citizen_id');
      const citizenIds = properties.map((p) => p.citizen_id).filter(Boolean);
      res.json({ pendingCitizens: citizenIds.length });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending citizens by zone", error: error.message });
    }
  };
  

  //charts

  // Fetch Citizens by District for the Bar Chart
exports.getCitizensCountByDistrict = async (req, res) => {
  try {
    // Aggregating citizens by district
    const result = await Citizen.aggregate([
      {
        $lookup: {
          from: "properties", // Join with the properties collection
          localField: "_id",
          foreignField: "citizen_id",
          as: "property",
        },
      },
      { $unwind: "$property" }, // Unwind the array of properties
      {
        $lookup: {
          from: "districts", // Join with the districts collection to get district name
          localField: "property.district_id",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" }, // Unwind to get the district name
      {
        $group: {
          _id: "$district.district_name", // Group by district name
          totalCitizens: { $sum: 1 }, // Sum the citizens for each district
        },
      },
      { $sort: { totalCitizens: -1 } }, // Sort the districts by the number of citizens in descending order
    ]);

    // Check if result is an array and send response
    if (Array.isArray(result) && result.length > 0) {
      return res.status(200).json(result); // Sending the result as a JSON response
    } else {
      return res.status(404).json({ message: "No data found for citizens by district" });
    }
  } catch (error) {
    console.error("Error fetching citizens by district:", error);
    return res.status(500).json({ message: "Error fetching citizens by district", error: error.message });
  }
};

  // Active, Inactive, and Pending Citizens by District pie chart
exports.getActiveInactiveCitizensByDistrict = async (req, res) => {
    try {
      // Aggregating active, inactive, and pending citizens by district
      const result = await Property.aggregate([
        {
          $group: {
            _id: "$district_id", // Group by district_id
            activeCitizens: {
              $sum: {
                $cond: [{ $eq: ["$status", "active"] }, 1, 0] // Count only active citizens
              },
            },
            inactiveCitizens: {
              $sum: {
                $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] // Count only inactive citizens
              },
            },
            pendingCitizens: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0] // Count only pending citizens
              },
            },
          },
        },
        {
          $lookup: {
            from: "districts", // Join with the districts collection to get district name
            localField: "_id",
            foreignField: "_id",
            as: "district",
          },
        },
        { $unwind: "$district" }, // Unwind the district to get the name
        {
          $project: {
            district_name: "$district.district_name", // Select district name
            activeCitizens: 1,
            inactiveCitizens: 1,
            pendingCitizens: 1,
          },
        },
        { $sort: { district_name: 1 } }, // Optional: Sort by district name
      ]);
  
      // Ensure the result is an array before sending
      if (Array.isArray(result)) {
        res.status(200).json(result); // Send the result if it's an array
      } else {
        res.status(500).json({ message: "Error: Data is not an array" });
      }
    } catch (error) {
      console.error("Error fetching citizens by district:", error);
      res.status(500).json({
        message: "Error fetching citizens by district",
        error: error.message,
      });
    }
  };
  
// Fetches count of citizens by branch for a given district
exports.getCitizensCountByBranch = async (req, res) => {
  const { districtId } = req.params;
  try {
    // Always use 'new' with ObjectId!
    const branches = await Branch.find({ district_id: new mongoose.Types.ObjectId(districtId) });
    const result = [];
    for (const branch of branches) {
      const citizensCount = await Property.countDocuments({ branch_id: branch._id });
      result.push({
        _id: branch._id,
        branch_name: branch.branch_name,
        totalCitizens: citizensCount,
      });
    }
    res.json(result);
  } catch (err) {
    console.error("Error in getCitizensCountByBranch:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Pie Chart Data: Active/Inactive/Pending Citizens by Branch in a District
exports.getCitizensStatusByBranch = async (req, res) => {
  const { districtId } = req.params;
  try {
    const branches = await Branch.find({ district_id: new mongoose.Types.ObjectId(districtId) });
    let active = 0, inactive = 0, pending = 0;
    for (const branch of branches) {
      active += await Property.countDocuments({ branch_id: branch._id, status: 'active' });
      inactive += await Property.countDocuments({ branch_id: branch._id, status: 'inactive' });
      pending += await Property.countDocuments({ branch_id: branch._id, status: 'pending' });
    }
    res.json({
      active,
      inactive,
      pending
    });
  } catch (err) {
    console.error("Error in getCitizensStatusByBranch:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

//DetailedBreakdown table
exports.getDetailedBreakdown = async (req, res) => {
    try {
      const { districtId } = req.params;
  
      if (!districtId || districtId === "all") {
        // Get top branch per district
        const result = await Property.aggregate([
          {
            $lookup: {
              from: "branches",
              localField: "branch_id",
              foreignField: "_id",
              as: "branch",
            },
          },
          { $unwind: "$branch" },
          {
            $lookup: {
              from: "zones",
              localField: "zone_id",
              foreignField: "_id",
              as: "zone",
            },
          },
          { $unwind: "$zone" },
          {
            $lookup: {
              from: "districts",
              localField: "district_id",
              foreignField: "_id",
              as: "district",
            },
          },
          { $unwind: "$district" },
  
          {
            $group: {
              _id: {
                district_id: "$district._id",
                branch_id: "$branch._id",
                zone_id: "$zone._id",
                district_name: "$district.district_name",
                branch_name: "$branch.branch_name",
                zone_name: "$zone.zone_name",
              },
              citizensCount: { $sum: 1 },
            },
          },
          {
            $sort: {
              "_id.district_name": 1,
              citizensCount: -1,
            },
          },
          {
            $group: {
              _id: "$_id.district_id",
              district_name: { $first: "$_id.district_name" },
              topBranch: { $first: "$_id.branch_name" },
              topZone: { $first: "$_id.zone_name" },
              citizensCount: { $first: "$citizensCount" },
            },
          },
          {
            $project: {
              _id: 0,
              district_name: 1,
              topBranch: 1,
              topZone: 1,
              citizensCount: 1,
            },
          },
        ]);
        res.json(result);
      } else {
        // districtId provided - show all branches and zones for that district
        const result = await Property.aggregate([
          { $match: { district_id: new mongoose.Types.ObjectId(districtId) } },
          {
            $lookup: {
              from: "branches",
              localField: "branch_id",
              foreignField: "_id",
              as: "branch",
            },
          },
          { $unwind: "$branch" },
          {
            $lookup: {
              from: "zones",
              localField: "zone_id",
              foreignField: "_id",
              as: "zone",
            },
          },
          { $unwind: "$zone" },
          {
            $group: {
              _id: {
                branch_id: "$branch._id",
                zone_id: "$zone._id",
                branch_name: "$branch.branch_name",
                zone_name: "$zone.zone_name",
              },
              citizensCount: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              branch_name: "$_id.branch_name",
              zone_name: "$_id.zone_name",
              citizensCount: 1,
            },
          },
          { $sort: { citizensCount: -1 } },
        ]);
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching detailed breakdown:", error);
      res.status(500).json({ message: "Error fetching detailed breakdown", error: error.message });
    }
  };

// Get ALL CITIZENS (with property + latest tax for each)
exports.getCitizensByAllDistrictsFull = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("citizen_id")
      .populate("district_id", "district_name")
      .populate("branch_id", "branch_name")
      .populate("zone_id", "zone_name")
      .lean();

    const citizens = await Promise.all(properties.map(async (property) => {
      // Find the latest tax document for this property
      const taxDoc = await Tax.findOne({ property_id: property._id })
                              .sort({ createdAt: -1 }); // or pick logic you need

      return {
        ...property.citizen_id,
        property: {
          house_no: property.house_no,
          house_rent: property.house_rent,
          tax: taxDoc ? taxDoc.tax_amount : "-",    // <-- tax comes from here!
          district: property.district_id?.district_name || "N/A",
          branch: property.branch_id?.branch_name || "N/A",
          zone: property.zone_id?.zone_name || "N/A",
          status: property.status || "Unknown",
        },
        district: property.district_id?.district_name || "N/A",
        branch: property.branch_id?.branch_name || "N/A",
        zone: property.zone_id?.zone_name || "N/A",
        house_rent: property.house_rent,
        tax: taxDoc ? taxDoc.tax_amount : "-",
      };
    }));

    res.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens with full property info:", error);
    res.status(500).json({ message: "Error fetching all full citizens info", error: error.message });
  }
};

exports.getCitizensByDistrictFull = async (req, res) => {
  try {
    const { districtId } = req.params;
    if (!districtId) return res.status(400).json({ message: "districtId required" });

    const properties = await Property.find({ district_id: districtId })
      .populate("citizen_id")
      .populate("district_id", "district_name")
      .populate("branch_id", "branch_name")
      .populate("zone_id", "zone_name")
      .lean();

      const citizens = await Promise.all(properties.map(async (property) => {
        const taxRecord = await Tax.findOne({ property_id: property._id }).lean();
        return {
          ...property.citizen_id,
          property: {
            house_no: property.house_no,
            house_rent: property.house_rent,
            tax: taxRecord?.tax_amount || "-",
            district: property.district_id?.district_name || "N/A",
            branch: property.branch_id?.branch_name || "N/A",
            zone: property.zone_id?.zone_name || "N/A",
            status: property.status || "Unknown",
          },
          district: property.district_id?.district_name || "N/A",
          branch: property.branch_id?.branch_name || "N/A",
          zone: property.zone_id?.zone_name || "N/A",
          house_rent: property.house_rent,
          tax: taxRecord?.tax_amount || "-",
        }
      }));

    res.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens by district full info:", error);
    res.status(500).json({ message: "Error fetching citizens by district full info", error: error.message });
  }
};

exports.getCitizensByBranchFull = async (req, res) => {
  try {
    const { branchId } = req.params;
    if (!branchId) return res.status(400).json({ message: "branchId required" });

    const properties = await Property.find({ branch_id: branchId })
      .populate("citizen_id")
      .populate("district_id", "district_name")
      .populate("branch_id", "branch_name")
      .populate("zone_id", "zone_name")
      .lean();

      const citizens = await Promise.all(properties.map(async (property) => {
        const taxRecord = await Tax.findOne({ property_id: property._id }).lean();
        return {
          ...property.citizen_id,
          property: {
            house_no: property.house_no,
            house_rent: property.house_rent,
            tax: taxRecord?.tax_amount || "-",
            district: property.district_id?.district_name || "N/A",
            branch: property.branch_id?.branch_name || "N/A",
            zone: property.zone_id?.zone_name || "N/A",
            status: property.status || "Unknown",
          },
          district: property.district_id?.district_name || "N/A",
          branch: property.branch_id?.branch_name || "N/A",
          zone: property.zone_id?.zone_name || "N/A",
          house_rent: property.house_rent,
          tax: taxRecord?.tax_amount || "-",
        }
      }));

    res.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens by branch full info:", error);
    res.status(500).json({ message: "Error fetching citizens by branch full info", error: error.message });
  }
};

// This function supports both 'statusChange' and 'deleteCitizen' requestType
exports.getRequestsByDistrict = async (req, res) => {
  try {
    // Step 1: For statusChange, join via property_id; for deleteCitizen, join via citizen_id -> property -> district
    // We'll use $facet to combine both

    const result = await StatusChangeRequest.aggregate([
      {
        $facet: {
          statusChange: [
            { $match: { requestType: "statusChange", property_id: { $exists: true, $ne: null } } },
            {
              $lookup: {
                from: "properties",
                localField: "property_id",
                foreignField: "_id",
                as: "property"
              }
            },
            { $unwind: "$property" },
            {
              $group: {
                _id: "$property.district_id",
                count: { $sum: 1 }
              }
            }
          ],
          deleteCitizen: [
            { $match: { requestType: "deleteCitizen", citizen_id: { $exists: true, $ne: null } } },
            {
              $lookup: {
                from: "properties",
                localField: "citizen_id",
                foreignField: "citizen_id",
                as: "property"
              }
            },
            { $unwind: "$property" },
            {
              $group: {
                _id: "$property.district_id",
                count: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        // Combine both requestType groupings
        $project: {
          combined: { $concatArrays: ["$statusChange", "$deleteCitizen"] }
        }
      },
      { $unwind: "$combined" },
      {
        $group: {
          _id: "$combined._id",
          count: { $sum: "$combined.count" }
        }
      },
      {
        $lookup: {
          from: "districts",
          localField: "_id",
          foreignField: "_id",
          as: "district"
        }
      },
      { $unwind: "$district" },
      {
        $project: {
          _id: 0,
          district_id: "$district._id",
          district_name: "$district.district_name",
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching requests by district" });
  }
};

// Get request counts by status (approved, rejected, pending)
exports.getRequestStatusCounts = async (req, res) => {
  try {
    const result = await StatusChangeRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    // Format for frontend
    const formatted = {
      approved: 0,
      rejected: 0,
      pending: 0,
    };
    result.forEach(item => {
      if (item._id && formatted.hasOwnProperty(item._id)) {
        formatted[item._id] = item.count;
      }
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch request status counts" });
  }
};





// Complaint report

// Utility: get filter for Property based on district/branch/zone
function getPropertyFilter(query) {
  const filter = {};
  if (query.district) filter['district_id'] = query.district;
  if (query.branch) filter['branch_id'] = query.branch;
  if (query.zone) filter['zone_id'] = query.zone;
  return filter;
}


// 1. Get total complaints count
exports.getTotalComplaints = async (req, res) => {
  try {
    let propertyFilter = getPropertyFilter(req.query);
    let propertyIds = [];
    if (Object.keys(propertyFilter).length > 0) {
      propertyIds = await Property.find(propertyFilter).distinct('_id');
    }
    const filter = propertyIds.length ? { property_id: { $in: propertyIds } } : {};
    const total = await Complaint.countDocuments(filter);
    res.json({ total });
  } catch (e) {
    res.status(500).json({ total: 0 });
  }
};

// 2. Get replied complaints count
exports.getRepliedComplaints = async (req, res) => {
  try {
    let propertyFilter = getPropertyFilter(req.query);
    let propertyIds = [];
    if (Object.keys(propertyFilter).length > 0) {
      propertyIds = await Property.find(propertyFilter).distinct('_id');
    }
    const filter = propertyIds.length ? { property_id: { $in: propertyIds }, reply: { $exists: true, $ne: "" } } : { reply: { $exists: true, $ne: "" } };
    const replied = await Complaint.countDocuments(filter);
    res.json({ replied });
  } catch (e) {
    res.status(500).json({ replied: 0 });
  }
};

// 3. Get unreplied complaints count
exports.getUnrepliedComplaints = async (req, res) => {
  try {
    let propertyFilter = getPropertyFilter(req.query);
    let propertyIds = [];
    if (Object.keys(propertyFilter).length > 0) {
      propertyIds = await Property.find(propertyFilter).distinct('_id');
    }
    const filter = propertyIds.length ? {
      property_id: { $in: propertyIds },
      $or: [{ reply: { $exists: false } }, { reply: "" }, { reply: null }]
    } : {
      $or: [{ reply: { $exists: false } }, { reply: "" }, { reply: null }]
    };
    const unreplied = await Complaint.countDocuments(filter);
    res.json({ unreplied });
  } catch (e) {
    res.status(500).json({ unreplied: 0 });
  }
};

// 4. Pie chart: replied/unreplied/pending (use unread if you want)
exports.getComplaintStatusPie = async (req, res) => {
  try {
    let propertyFilter = getPropertyFilter(req.query);
    let propertyIds = [];
    if (Object.keys(propertyFilter).length > 0) {
      propertyIds = await Property.find(propertyFilter).distinct('_id');
    }
    const baseFilter = propertyIds.length ? { property_id: { $in: propertyIds } } : {};

    const replied = await Complaint.countDocuments({ ...baseFilter, reply: { $exists: true, $ne: "" } });
    const unreplied = await Complaint.countDocuments({ ...baseFilter, $or: [{ reply: { $exists: false } }, { reply: "" }, { reply: null }] });
    const pending = await Complaint.countDocuments({ ...baseFilter, isRead: false }); // or however you define pending

    res.json({ replied, unreplied, pending });
  } catch (e) {
    res.status(500).json({ replied: 0, unreplied: 0, pending: 0 });
  }
};

// 5. Bar chart: complaints count by district
exports.getComplaintsCountByDistrict = async (req, res) => {
  try {
    const result = await Complaint.aggregate([
      {
        $lookup: {
          from: 'properties',
          localField: 'property_id',
          foreignField: '_id',
          as: 'property'
        }
      },
      { $unwind: "$property" },
      {
        $lookup: {
          from: 'districts',
          localField: 'property.district_id',
          foreignField: '_id',
          as: 'district'
        }
      },
      { $unwind: "$district" },
      {
        $group: {
          _id: "$district._id",
          district_name: { $first: "$district.district_name" },
          count: { $sum: 1 }
        }
      },
      { $sort: { district_name: 1 } }
    ]);
    res.json(result);
  } catch (e) {
    res.status(500).json([]);
  }
};


exports.getComplaintsCountByBranch = async (req, res) => {
  try {
    const districtId = req.params.districtId;

    // Get all branches for this district
    const branches = await Branch.find({ district_id: districtId });

    // For each branch, count complaints
    const result = await Promise.all(branches.map(async (branch) => {
      // Get all properties in this branch
      const properties = await Property.find({ branch_id: branch._id });
      const propertyIds = properties.map(p => p._id);

      // Count complaints for these properties
      const count = await Complaint.countDocuments({ property_id: { $in: propertyIds } });

      return {
        branch_id: branch._id,
        branch_name: branch.branch_name,
        count
      };
    }));

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// 6. Grouped table: complaints grouped by district, branch, zone, citizen, complaint text, status
exports.getGroupedComplaints = async (req, res) => {
  try {
    let propertyFilter = getPropertyFilter(req.query);
    let propertyIds = [];
    if (Object.keys(propertyFilter).length > 0) {
      propertyIds = await Property.find(propertyFilter).distinct('_id');
    }
    const filter = propertyIds.length ? { property_id: { $in: propertyIds } } : {};

    const complaints = await Complaint.find(filter)
      .populate({
        path: 'citizen_id',
        select: 'name'
      })
      .populate({
        path: 'property_id',
        select: 'district_id branch_id zone_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' },
          { path: 'zone_id', select: 'zone_name' }
        ]
      })
      .lean();

    // Structure for the table
    const table = complaints.map(c => ({
      district_name: c.property_id?.district_id?.district_name || "-",
      branch_name: c.property_id?.branch_id?.branch_name || "-",
      zone_name: c.property_id?.zone_id?.zone_name || "-",
      citizen_name: c.citizen_id?.name || "-",
      description: c.complaint_description,
      reply_status: c.reply && c.reply.trim() !== "" ? "replied" : "unreplied"
    }));

    res.json(table);
  } catch (e) {
    res.status(500).json([]);
  }
};







//Payment report
const Payment = require('../models/Payment');
const TaxCollection = require('../models/TaxCollection');
const District = require('../models/District'); // Make sure this import is included


// PAYMENT REPORT: Total Collected, Paid, Due (filtered by district)

exports.getPaymentReport = async (req, res) => {
  try {
    const { district, branch, zone } = req.query;

    let propertyFilter = {};

    if (zone && zone !== "All Zones") {
      const properties = await Property.find({ zone_id: zone }).select('_id');
      const propertyIds = properties.map((p) => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    } else if (branch && branch !== "All Branches") {
      const properties = await Property.find({ branch_id: branch }).select('_id');
      const propertyIds = properties.map((p) => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    } else if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('_id');
      const propertyIds = properties.map((p) => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    const payments = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $group: {
          _id: "$citizen_id",
          status: { $first: "$tax_collection_id.status" },
          totalPaidAmount: { $sum: "$payment_amount" }
        }
      },
      {
        $project: {
          citizen_id: "$_id",
          status: { $cond: [{ $eq: ["$totalPaidAmount", 0] }, "due", "paid"] },
          totalPaidAmount: 1
        }
      }
    ]);

    const revenueAgg = await Payment.aggregate([
      { $match: propertyFilter },
      { $group: { _id: null, totalRevenue: { $sum: "$payment_amount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    let paidCount = 0, dueCount = 0;
    payments.forEach(payment => {
      if (payment.status === "paid") paidCount++;
      else dueCount++;
    });

    res.status(200).json([{
      totalAmount: totalRevenue,
      paid: paidCount,
      overdue: dueCount,
    }]);
  } catch (error) {
    console.error("Error fetching payment report:", error);
    res.status(500).json({ message: "Failed to fetch payment report", error: error.message });
  }
};


// CITIZENS WITH DUE TAX (No Payment, All Due) filtered by district
// exports.countCitizensWithDueTax = async (req, res) => {
//   try {
//     const { district } = req.query;
//     let matchStage = { status: "due" };

//     // Filter by district
//     if (district && district !== "All Districts") {
//       const properties = await Property.find({ district_id: district }).select('citizen_id');
//       const citizenIds = properties.map(p => p.citizen_id);
//       matchStage.citizen_id = { $in: citizenIds };
//     }
//     matchStage.amount_due = { $gt: 0 }; // only tax records with an actual due amount

//     // Aggregation pipeline
//     const pipeline = [
//       { $match: matchStage },
//       { $group: { _id: "$citizen_id" } },
//       { $lookup: {
//           from: "payments",
//           localField: "_id",
//           foreignField: "citizen_id",
//           as: "payments"
//         }
//       },
//       { $match: { payments: { $size: 0 } } },
//       { $count: "dueCount" }
//     ];

//     const result = await TaxCollection.aggregate(pipeline);
//     const dueCount = result.length > 0 ? result[0].dueCount : 0;

//     res.status(200).json({ dueCount });
//   } catch (error) {
//     console.error("Error counting citizens with due tax:", error);
//     res.status(500).json({
//       message: "Failed to count citizens with due tax.",
//       error: error.message || error,
//     });
//   }
// };
exports.countCitizensWithDueTax = async (req, res) => {
  try {
    const { district, branch, zone } = req.query;
    let matchStage = { status: "due", amount_due: { $gt: 0 } }; // Only due taxes

    // Build citizen_id filter via Property model
    let citizenFilter = {};

    if (zone && zone !== "All Zones") {
      const properties = await Property.find({ zone_id: zone }).select('citizen_id');
      const citizenIds = properties.map(p => p.citizen_id);
      citizenFilter = { citizen_id: { $in: citizenIds } };
    } else if (branch && branch !== "All Branches") {
      const properties = await Property.find({ branch_id: branch }).select('citizen_id');
      const citizenIds = properties.map(p => p.citizen_id);
      citizenFilter = { citizen_id: { $in: citizenIds } };
    } else if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('citizen_id');
      const citizenIds = properties.map(p => p.citizen_id);
      citizenFilter = { citizen_id: { $in: citizenIds } };
    }

    // Merge property filter with tax filter
    matchStage = { ...matchStage, ...citizenFilter };

    const pipeline = [
      { $match: matchStage },
      { $group: { _id: "$citizen_id" } },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "citizen_id",
          as: "payments"
        }
      },
      { $match: { payments: { $size: 0 } } },
      { $count: "dueCount" }
    ];

    const result = await TaxCollection.aggregate(pipeline);
    const dueCount = result.length > 0 ? result[0].dueCount : 0;

    res.status(200).json({ dueCount });
  } catch (error) {
    console.error("Error counting citizens with due tax:", error);
    res.status(500).json({
      message: "Failed to count citizens with due tax.",
      error: error.message || error,
    });
  }
};





  exports.getTaxCollectionCountByStatus = async (req, res) => {
    try {
      const { district } = req.query;
      let matchStage = {};
  
      if (district && district !== "All Districts") {
        // Get all property IDs for this district
        const properties = await Property.find({ district_id: district }).select('_id citizen_id');
        const citizenIds = properties.map(p => p.citizen_id);
        matchStage.citizen_id = { $in: citizenIds };
      }
  
      // 1. Get all distinct citizen IDs from TaxCollection for this filter
      const taxRecords = await TaxCollection.find(matchStage).select('citizen_id status tax_id').lean();
  
      // Group by citizen
      const citizenTaxMap = {};
      for (const rec of taxRecords) {
        if (!citizenTaxMap[rec.citizen_id]) citizenTaxMap[rec.citizen_id] = [];
        citizenTaxMap[rec.citizen_id].push(rec);
      }
  
      let paidCount = 0;
      let dueCount = 0;
  
      // 2. For each citizen, determine payment status
      for (const [citizenId, records] of Object.entries(citizenTaxMap)) {
        // If all quarters for citizen are due
        const allDue = records.every(r => r.status === 'due');
        if (allDue) {
          // Check for Payment for any of their tax_ids
          const taxIds = records.map(r => r.tax_id);
          const payment = await Payment.findOne({ tax_collection_id: { $in: taxIds }, citizen_id: citizenId });
          if (payment) paidCount++;
          else dueCount++;
        } else {
          // Has at least one not-due status, so count as paid
          paidCount++;
        }
      }
  
      res.status(200).json({
        paidCount,
        dueCount
      });
  
    } catch (error) {
      console.error("Error fetching tax collection counts:", error);
      res.status(500).json({
        message: "Failed to fetch tax collection counts.",
        error: error.message || error,
      });
    }
  };



 // Payment Breakdown by District, Branch, and Zone
// Payment Breakdown by District (Updated to exclude branch and zone)
exports.getPaymentBreakdownByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    // Property filter by district only (without branch and zone)
    const propertyFilter = {};
    if (district && district !== "All Districts") {
      propertyFilter.district_id = district;
    }

    // Aggregate payments for each district
    const payments = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $group: {
          _id: "$district_id",  // Group by district_id
          totalAmount: { $sum: "$payment_amount" },
          paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$payment_amount", 0] } },
          overdue: { $sum: { $cond: [{ $eq: ["$status", "due"] }, "$payment_amount", 0] } }
        }
      },
      {
        $lookup: {
          from: "districts", 
          localField: "_id",
          foreignField: "_id",
          as: "district"
        }
      },
      { $unwind: "$district" },
      {
        $project: {
          district_name: "$district.district_name",
          totalAmount: 1,
          paid: 1,
          overdue: 1
        }
      }
    ]);

    res.status(200).json(payments); // Send the data
  } catch (error) {
    console.error("Error fetching payment breakdown by district:", error);
    res.status(500).json({
      message: "Failed to fetch payment breakdown by district.",
      error: error.message || error,
    });
  }
};


// New method to get the total paid and due payments for a district, branch, or zone
// Controller to get Paid and Due Citizens
exports.getPaidAndDueCitizens = async (req, res) => {
  try {
    const { district } = req.query;

    // Property filter by district
    let propertyFilter = {};
    if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('_id');
      const propertyIds = properties.map(p => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    // Aggregating paid citizens from the Payment Report
    const paymentReport = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $group: {
          _id: "$citizen_id",
          totalPaidAmount: { $sum: "$payment_amount" }
        }
      },
      {
        $project: {
          citizen_id: "$_id",
          status: { $cond: [{ $eq: ["$totalPaidAmount", 0] }, "due", "paid"] },
          totalPaidAmount: 1
        }
      }
    ]);

    let paidCount = 0;
    let dueCount = 0;

    // Count paid and due
    paymentReport.forEach(payment => {
      if (payment.status === "paid") paidCount++;
      else if (payment.status === "due") dueCount++;
    });

    // Aggregating unpaid citizens (due) based on tax collection method
    const taxPipeline = [
      { $match: { status: "due", amount_due: { $gt: 0 } } }, // Match due tax records
      { $group: { _id: "$citizen_id" } }, // Group by citizen
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "citizen_id",
          as: "payments"
        }
      },
      { $match: { payments: { $size: 0 } } }, // Only include citizens with no payment records
      { $count: "dueCount" }
    ];

    const dueCitizensResult = await TaxCollection.aggregate(taxPipeline);
    const dueCitizens = dueCitizensResult.length > 0 ? dueCitizensResult[0].dueCount : 0;

    // Return both paid and due citizens count
    res.status(200).json({
      paidCitizens: paidCount,
      dueCitizens: dueCitizens
    });

  } catch (error) {
    console.error("Error fetching paid and due citizens:", error);
    res.status(500).json({
      message: "Failed to fetch paid and due citizens.",
      error: error.message || error,
    });
  }
};


//Barchart
// Fetch total collected amount per district
exports.getTotalCollectedByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    // If a district is selected, filter payments for the selected district
    let propertyFilter = {};
    if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('_id');
      const propertyIds = properties.map(p => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    // Aggregate payments by district (directly using Payment model)
    const result = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $lookup: {
          from: "properties", // Lookup in the Property collection
          localField: "property_id", // Field from Payment
          foreignField: "_id", // Matching field from Property
          as: "property",
        },
      },
      { $unwind: "$property" }, // Unwind property to access district_id
      {
        $lookup: {
          from: "districts", // Lookup in the District collection
          localField: "property.district_id", // Field from Property
          foreignField: "_id", // Matching field from District
          as: "district", // Array of district
        },
      },
      { $unwind: "$district" }, // Unwind the district array
      {
        $group: {
          _id: "$district._id", // Group by district_id
          district_name: { $first: "$district.district_name" }, // Get district name
          totalAmount: { $sum: "$payment_amount" }, // Sum the payment amount
        },
      },
      {
        $project: {
          district_name: 1,
          totalAmount: 1,
        },
      },
    ]);

    // If no results found, return all districts with total 0
    const allDistricts = await District.find({});
    const response = allDistricts.map(district => {
      const districtData = result.find(item => item.district_name === district.district_name);
      return {
        district_name: district.district_name,
        totalAmount: districtData ? districtData.totalAmount : 0,  // Default to 0 if no data found
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching total collected by district:", error);
    res.status(500).json({
      message: "Failed to fetch total collected by district.",
      error: error.message || error,
    });
  }
};

// This will fetch total collected payments by branch
exports.getTotalCollectedByBranch = async (req, res) => {
  try {
    const { district } = req.query;

    // If a district is selected, filter payments for the selected district
    let propertyFilter = {};
    if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('_id');
      const propertyIds = properties.map(p => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    // Aggregate payments by branch (directly using Payment model)
    const result = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $lookup: {
          from: "properties", // Lookup in the Property collection
          localField: "property_id", // Field from Payment
          foreignField: "_id", // Matching field from Property
          as: "property",
        },
      },
      { $unwind: "$property" }, // Unwind property to access branch_id
      {
        $lookup: {
          from: "branches", // Lookup in the Branch collection
          localField: "property.branch_id", // Field from Property
          foreignField: "_id", // Matching field from Branch
          as: "branch", // Array of branch
        },
      },
      { $unwind: "$branch" }, // Unwind the branch array
      {
        $group: {
          _id: "$branch._id", // Group by branch_id
          branch_name: { $first: "$branch.branch_name" }, // Get branch name
          totalAmount: { $sum: "$payment_amount" }, // Sum the payment amount
        },
      },
      {
        $project: {
          branch_name: 1,
          totalAmount: 1,
        },
      },
    ]);

    // If no results found, return all branches with total 0
    const allBranches = await Branch.find({ district_id: district }); // Filter branches by the selected district
    const response = allBranches.map(branch => {
      const branchData = result.find(item => item.branch_name === branch.branch_name);
      return {
        branch_name: branch.branch_name,
        totalAmount: branchData ? branchData.totalAmount : 0,  // Default to 0 if no data found
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching total collected by branch:", error);
    res.status(500).json({
      message: "Failed to fetch total collected by branch.",
      error: error.message || error,
    });
  }
};




// 1. Endpoint for pie chart (Paid vs Unpaid for a specific district)
// Updated endpoint for calculating Due Citizens by District
exports.getPaidUnpaidByDistrict = async (req, res) => {
    try {
        const { district } = req.query;
        
        let propertyFilter = {};
        if (district && district !== "All Districts") {
            const properties = await Property.find({ district_id: district }).select('_id');
            const propertyIds = properties.map(p => p._id);
            propertyFilter.property_id = { $in: propertyIds };
        }

        const payments = await Payment.aggregate([
            { $match: propertyFilter },
            { $group: { _id: "$citizen_id", totalPaidAmount: { $sum: "$payment_amount" } } },
            { $project: { status: { $cond: [{ $eq: ["$totalPaidAmount", 0] }, "unpaid", "paid"] }, totalPaidAmount: 1 } }
        ]);

        let paidCount = 0;
        let unpaidCount = 0;

        payments.forEach(payment => {
            if (payment.status === "paid") paidCount++;
            else if (payment.status === "unpaid") unpaidCount++;
        });

        res.status(200).json({ paidCitizens: paidCount, unpaidCitizens: unpaidCount });
    } catch (error) {
        console.error("Error fetching payment status by district:", error);
        res.status(500).json({ message: "Failed to fetch payment status by district.", error: error.message || error });
    }
};

// GET /api/report/paid-unpaid-by-branch?branch=branchId
exports.getPaidUnpaidByBranch = async (req, res) => {
  try {
    const { branch } = req.query;

    let propertyFilter = {};
    if (branch && branch !== "All Branches") {
      // Filter properties based on the selected branch
      const properties = await Property.find({ branch_id: branch }).select("_id");
      const propertyIds = properties.map((p) => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    // Aggregate payment data grouped by citizen_id, summing the paid amount
    const payments = await Payment.aggregate([
      { $match: propertyFilter },
      { 
        $group: {
          _id: "$citizen_id",  // Group by citizen_id
          totalPaidAmount: { $sum: "$payment_amount" }  // Sum payment amounts
        }
      },
      { 
        $project: { 
          status: { 
            $cond: [
              { $eq: ["$totalPaidAmount", 0] }, "unpaid", "paid"  // If no payment, classify as unpaid
            ]
          },
          totalPaidAmount: 1  // Return totalPaidAmount for verification
        }
      }
    ]);

    let paidCount = 0;
    let unpaidCount = 0;

    // Count the paid and unpaid based on the status
    payments.forEach((payment) => {
      if (payment.status === "paid") {
        paidCount++;
      } else {
        unpaidCount++;
      }
    });

    // Respond with the counts of paid and unpaid citizens
    res.status(200).json({ paidCitizens: paidCount, unpaidCitizens: unpaidCount });

  } catch (error) {
    console.error("Error fetching branch payments:", error);
    res.status(500).json({ message: "Error fetching branch data", error: error.message || error });
  }
};



// 2. Endpoint for bar chart (Total amount per branch in the selected district)
// Controller to get Payment Amount by Branch for a given District
exports.getPaymentAmountByBranch = async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ message: "District ID is required" });
  }

  try {
    // Aggregate payment data by branch and district
    const payments = await Payment.aggregate([
      { 
        $match: { "district_id": district } // Filter payments by district
      },
      {
        $lookup: {
          from: "properties",
          localField: "property_id",
          foreignField: "_id",
          as: "property",
        }
      },
      { 
        $unwind: "$property" // Unwind property array to get individual properties
      },
      {
        $lookup: {
          from: "branches",  // Join with branches collection to get branch name
          localField: "property.branch_id",
          foreignField: "_id",
          as: "branch"
        }
      },
      { 
        $unwind: "$branch"  // Unwind the branch array to get branch name
      },
      {
        $group: {  // Group by branch and calculate total payment amount
          _id: "$branch._id",
          branch_name: { $first: "$branch.branch_name" },
          totalAmount: { $sum: "$payment_amount" },
        }
      },
      {
        $project: {
          _id: 0,
          branch_name: 1,
          totalAmount: 1,
        }
      }
    ]);

    if (payments.length > 0) {
      res.status(200).json(payments);  // Send the aggregated result
    } else {
      res.status(404).json({ message: "No payments found for the selected district" });
    }
  } catch (error) {
    console.error("Error fetching payment amount by branch:", error);
    res.status(500).json({
      message: "Error fetching payment amount by branch",
      error: error.message
    });
  }
};




// breakdown table endpoint:
exports.getPaymentTableByDistrict = async (req, res) => {
  try {
    const allDistricts = await District.find({});
    const results = await Promise.all(
      allDistricts.map(async (district) => {
        // Find properties and citizens in this district
        const properties = await Property.find({ district_id: district._id }).select('_id citizen_id');
        const propertyIds = properties.map(p => p._id);
        const citizenIds = properties.map(p => p.citizen_id);

        // PAID: citizens who have made any payment in this district
        const paidPayments = await Payment.aggregate([
          { $match: { property_id: { $in: propertyIds } } },
          { $group: { _id: "$citizen_id", totalPaidAmount: { $sum: "$payment_amount" } } },
          { $match: { totalPaidAmount: { $gt: 0 } } }
        ]);
        const paidCount = paidPayments.length;

        // OVERDUE: use your "countCitizensWithDueTax" logic, but filtered by these citizens
        const pipeline = [
          { $match: { status: "due", amount_due: { $gt: 0 }, citizen_id: { $in: citizenIds } } },
          { $group: { _id: "$citizen_id" } },
          {
            $lookup: {
              from: "payments",
              localField: "_id",
              foreignField: "citizen_id",
              as: "payments"
            }
          },
          { $match: { payments: { $size: 0 } } }, // Unpaid only
          { $count: "dueCount" }
        ];
        const overdueAgg = await TaxCollection.aggregate(pipeline);
        const overdueCount = overdueAgg.length > 0 ? overdueAgg[0].dueCount : 0;

        // Total collected for this district (sum payment_amount for all props)
        const payments = await Payment.aggregate([
          { $match: { property_id: { $in: propertyIds } } },
          { $group: { _id: null, totalAmount: { $sum: "$payment_amount" } } }
        ]);
        const totalAmount = payments.length > 0 ? payments[0].totalAmount : 0;

        return {
          district: district.district_name,
          totalAmount,
          paid: paidCount,
          overdue: overdueCount,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching payment table by district:", error);
    res.status(500).json({ message: "Failed to fetch payment table by district.", error: error.message });
  }
};

// Make sure these are imported

exports.getPaymentTableByBranch = async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ message: "District is required" });
    }

    const branches = await Branch.find({ district_id: district });

    const results = await Promise.all(
      branches.map(async (branch) => {
        const properties = await Property.find({ branch_id: branch._id }).select('_id citizen_id');
        const propertyIds = properties.map(p => p._id);
        const citizenIds = properties.map(p => p.citizen_id);

        // Paid: citizens with any payment in this branch
        const paidPayments = await Payment.aggregate([
          { $match: { property_id: { $in: propertyIds } } },
          { $group: { _id: "$citizen_id", totalPaidAmount: { $sum: "$payment_amount" } } },
          { $match: { totalPaidAmount: { $gt: 0 } } }
        ]);
        const paidCount = paidPayments.length;

        // Overdue: citizens with due tax & no payments
        const pipeline = [
          { $match: { status: "due", amount_due: { $gt: 0 }, citizen_id: { $in: citizenIds } } },
          { $group: { _id: "$citizen_id" } },
          {
            $lookup: {
              from: "payments",
              localField: "_id",
              foreignField: "citizen_id",
              as: "payments"
            }
          },
          { $match: { payments: { $size: 0 } } },
          { $count: "dueCount" }
        ];
        const overdueAgg = await TaxCollection.aggregate(pipeline);
        const overdueCount = overdueAgg.length > 0 ? overdueAgg[0].dueCount : 0;

        // Total collected
        const payments = await Payment.aggregate([
          { $match: { property_id: { $in: propertyIds } } },
          { $group: { _id: null, totalAmount: { $sum: "$payment_amount" } } }
        ]);
        const totalAmount = payments.length > 0 ? payments[0].totalAmount : 0;

        return {
          branch: branch.branch_name,
          totalAmount,
          paid: paidCount,
          overdue: overdueCount,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching payment table by branch:", error);
    res.status(500).json({ message: "Failed to fetch payment table by branch.", error: error.message });
  }
};

// GET /api/report/payments/all
// GET /api/report/payments/all
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .populate({ path: 'tax_collection_id', select: 'status amount_due' })
      .lean();

    const dues = await TaxCollection.find({ status: { $ne: 'paid' } })
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .lean();

    // Paid rows
    const paidRows = payments.map((p) => ({
      house_no: p.property_id?.house_no || "-",
      citizen: p.citizen_id?.name || "-",
      phone: p.citizen_id?.phone_number || "-",
      amount_paid: p.payment_amount || 0,
      amount_due: p.tax_collection_id?.amount_due || 0,
      status: "paid",
      date: p.createdAt,
    }));

    // Due rows
    const dueRows = dues.map((d) => ({
      house_no: d.property_id?.house_no || "-",
      citizen: d.citizen_id?.name || "-",
      phone: d.citizen_id?.phone_number || "-",
      amount_paid: d.amount_paid || 0,
      amount_due: d.amount_due || d.total_due || 0,
      status: d.status || "due",
      date: d.updatedAt || d.createdAt,
    }));

    // Merge, sort, and add 'no'
    const allRows = [...paidRows, ...dueRows].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    const tableRows = allRows.map((row, i) => ({
      no: i + 1,
      ...row,
    }));

    res.json(tableRows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all payments", error: error.message });
  }
};


// /api/report/payments/by-district/:districtId
// GET /api/report/payments/by-district/:districtId
exports.getPaymentsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    const properties = await Property.find({ district_id: districtId }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const payments = await Payment.find({ property_id: { $in: propertyIds } })
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .populate({ path: 'tax_collection_id', select: 'status amount_due' })
      .lean();

    const dues = await TaxCollection.find({ property_id: { $in: propertyIds }, status: { $ne: 'paid' } })
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .lean();

    const paidRows = payments.map((p) => ({
      house_no: p.property_id?.house_no || "-",
      citizen: p.citizen_id?.name || "-",
      phone: p.citizen_id?.phone_number || "-",
      amount_paid: p.payment_amount || 0,
      amount_due: p.tax_collection_id?.amount_due || 0,
      status: "paid",
      date: p.createdAt,
    }));

    const dueRows = dues.map((d) => ({
      house_no: d.property_id?.house_no || "-",
      citizen: d.citizen_id?.name || "-",
      phone: d.citizen_id?.phone_number || "-",
      amount_paid: d.amount_paid || 0,
      amount_due: d.amount_due || d.total_due || 0,
      status: d.status || "due",
      date: d.updatedAt || d.createdAt,
    }));

    const allRows = [...paidRows, ...dueRows].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    const tableRows = allRows.map((row, i) => ({
      no: i + 1,
      ...row,
    }));

    res.json(tableRows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch district payments", error: error.message });
  }
};



// /api/report/payments/by-branch/:branchId
// GET /api/report/payments/by-branch/:branchId
exports.getPaymentsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const properties = await Property.find({ branch_id: branchId }).select('_id');
    const propertyIds = properties.map(p => p._id);

    const payments = await Payment.find({ property_id: { $in: propertyIds } })
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .populate({ path: 'tax_collection_id', select: 'status amount_due' })
      .lean();

    const dues = await TaxCollection.find({ property_id: { $in: propertyIds }, status: { $ne: 'paid' } })
      .populate({ path: 'citizen_id', select: 'name phone_number' })
      .populate({ path: 'property_id', select: 'house_no' })
      .lean();

    const paidRows = payments.map((p) => ({
      house_no: p.property_id?.house_no || "-",
      citizen: p.citizen_id?.name || "-",
      phone: p.citizen_id?.phone_number || "-",
      amount_paid: p.payment_amount || 0,
      amount_due: p.tax_collection_id?.amount_due || 0,
      status: "paid",
      date: p.createdAt,
    }));

    const dueRows = dues.map((d) => ({
      house_no: d.property_id?.house_no || "-",
      citizen: d.citizen_id?.name || "-",
      phone: d.citizen_id?.phone_number || "-",
      amount_paid: d.amount_paid || 0,
      amount_due: d.amount_due || d.total_due || 0,
      status: d.status || "due",
      date: d.updatedAt || d.createdAt,
    }));

    const allRows = [...paidRows, ...dueRows].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    const tableRows = allRows.map((row, i) => ({
      no: i + 1,
      ...row,
    }));

    res.json(tableRows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branch payments", error: error.message });
  }
};






// Dashboard dynamic report 

exports.getDistrictPaymentsByYear = async (req, res) => {
  const { year } = req.query;
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

  const result = await Payment.aggregate([
    {
      $match: {
        payment_date: { $gte: start, $lt: end }
      }
    },
    {
      $lookup: {
        from: 'properties',
        localField: 'property_id',
        foreignField: '_id',
        as: 'property'
      }
    },
    { $unwind: "$property" },
    {
      $group: {
        _id: "$property.district_id", // group by district ID
        total: { $sum: "$payment_amount" }
      }
    },
    {
      $lookup: {
        from: "districts",
        localField: "_id",
        foreignField: "_id",
        as: "district"
      }
    },
    { $unwind: "$district" },
    {
      $project: {
        _id: 0,
        districtId: "$_id",
        districtName: "$district.district_name",
        total: 1
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);

  res.json(result);
};


exports.getTotalPaymentsByYear = async (req, res) => {
  try {
    // Group payments by year and sum payment_amount for each year
    const result = await Payment.aggregate([
      {
        $group: {
          _id: { $year: "$payment_date" },
          total: { $sum: "$payment_amount" }
        }
      },
      { $sort: { _id: 1 } } // Sort by year ascending
    ]);

    // Convert _id (year) to 'year'
    const formatted = result.map(item => ({
      year: item._id,
      total: item.total
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


exports.getPaidAndDueCitizens = async (req, res) => {
  try {
    const { district } = req.query;

    // Property filter by district
    let propertyFilter = {};
    if (district && district !== "All Districts") {
      const properties = await Property.find({ district_id: district }).select('_id');
      const propertyIds = properties.map(p => p._id);
      propertyFilter.property_id = { $in: propertyIds };
    }

    // Aggregating paid citizens from the Payment Report
    const paymentReport = await Payment.aggregate([
      { $match: propertyFilter },
      {
        $group: {
          _id: "$citizen_id",
          totalPaidAmount: { $sum: "$payment_amount" }
        }
      },
      {
        $project: {
          citizen_id: "$_id",
          status: { $cond: [{ $eq: ["$totalPaidAmount", 0] }, "due", "paid"] },
          totalPaidAmount: 1
        }
      }
    ]);

    let paidCount = 0;
    let dueCount = 0;

    // Count paid and due
    paymentReport.forEach(payment => {
      if (payment.status === "paid") paidCount++;
      else if (payment.status === "due") dueCount++;
    });

    // Aggregating unpaid citizens (due) based on tax collection method
    const taxPipeline = [
      { $match: { status: "due", amount_due: { $gt: 0 } } }, // Match due tax records
      { $group: { _id: "$citizen_id" } }, // Group by citizen
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "citizen_id",
          as: "payments"
        }
      },
      { $match: { payments: { $size: 0 } } }, // Only include citizens with no payment records
      { $count: "dueCount" }
    ];

    const dueCitizensResult = await TaxCollection.aggregate(taxPipeline);
    const dueCitizens = dueCitizensResult.length > 0 ? dueCitizensResult[0].dueCount : 0;

    // Return both paid and due citizens count
    res.status(200).json({
      paidCitizens: paidCount,
      dueCitizens: dueCitizens
    });

  } catch (error) {
    console.error("Error fetching paid and due citizens:", error);
    res.status(500).json({
      message: "Failed to fetch paid and due citizens.",
      error: error.message || error,
    });
  }
};




exports.getActiveAndInactiveCitizens = async (req, res) => {
  try {
    const { district } = req.query;
    let propertyMatch = {};

    if (district && district !== "All Districts") {
      propertyMatch["property.district_id"] = new mongoose.Types.ObjectId(district);
    }
    
    const result = await Citizen.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "citizen_id",
          as: "property"
        }
      },
      { $unwind: "$property" },
      ...(district && district !== "All Districts" ? [{ $match: propertyMatch }] : []),
      {
        $facet: {
          active: [
            { $match: { "property.status": "active" } },
            { $count: "count" }
          ],
          inactive: [
            { $match: { "property.status": "inactive" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const activeCitizens = result[0].active.length > 0 ? result[0].active[0].count : 0;
    const inactiveCitizens = result[0].inactive.length > 0 ? result[0].inactive[0].count : 0;

    res.status(200).json({ activeCitizens, inactiveCitizens });
  } catch (error) {
    console.error("Error fetching active/inactive citizens:", error);
    res.status(500).json({
      message: "Error fetching active/inactive citizens",
      error: error.message
    });
  }
};
