const Complaint = require('../models/Complaint');
const District = require('../models/District'); // import your District model
const Property = require('../models/Property');
const mongoose = require("mongoose");

// Get all complaints
//  for a specific citizen
exports.getAllComplaints = async (req, res) => {
  try {
    const citizenId = req.query.citizenId; // Get citizenId from query params

    if (!citizenId) {
      return res.status(400).json({ message: 'citizenId query parameter is required' });
    }

    const complaints = await Complaint.find({ citizen_id: citizenId })
      .select('complaint_description createdAt')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load complaints', error: error.message });
  }
};
// Create a new complaint
// Create complaint(s)
exports.createComplaint = async (req, res) => {
    try {
      if (Array.isArray(req.body)) {
        // Insert multiple complaints at once
        const complaints = await Complaint.insertMany(req.body);
        return res.status(201).json(complaints);
      } else {
        // Insert a single complaint
        const { citizen_id, property_id, complaint_description } = req.body;
        const newComplaint = new Complaint({ citizen_id, property_id, complaint_description });
        await newComplaint.save();
        return res.status(201).json(newComplaint);
      }
    } catch (error) {
      console.error('Error creating complaint(s):', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Your existing getAllComplaints stays as is...

// New function to get complaints with full citizen and property details populated
// exports.getDetailedComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find({})
//       .populate({
//         path: 'citizen_id',
//         select: 'name avatar',
//       })
//       .populate({
//         path: 'property_id',
//         select: 'house_no district_id branch_id zone_id',
//         populate: [
//           { path: 'district_id', select: 'district_name' },
//           { path: 'branch_id', select: 'branch_name' },
//           { path: 'zone_id', select: 'zone_name' },
//         ],
//       })
//       .select('complaint_description createdAt citizen_id property_id')
//       .sort({ createdAt: -1 });

//     res.json(complaints);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to load complaints', error: error.message });
//   }
// };



// complaintController.js

exports.countUnreadComplaints = async (req, res) => {
    try {
      const count = await Complaint.countDocuments({ isRead: false });
      res.json({ count });
    } catch (error) {
      console.error("Error counting unread complaints:", error);
      res.status(500).json({ message: "Failed to count unread complaints", error: error.message });
    }
  };
  
  exports.markComplaintAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Complaint.findByIdAndUpdate(id, { isRead: true }, { new: true });
      if (!updated) return res.status(404).json({ message: "Complaint not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark complaint as read", error: error.message });
    }
  };
  
  // Get complaints filtered by user's district
// exports.getComplaintsByDistrict = async (req, res) => {
//   try {
//     const district = req.params.district;
//     // Query complaints where the citizen's district = requested district
//     // Haddii district ku jiro citizen model-ka, ama property model-ka, ku filter

//     // Example assuming 'citizen_id' field populated and citizen model has district:
//     const complaints = await Complaint.find()
//       .populate({
//         path: 'citizen_id',
//         match: { district: district }, // Filter by district here
//         select: 'name avatar district',
//       })
//       .sort({ createdAt: -1 });

//     // Filter out complaints whose citizen_id is null (because district did not match)
//     const filteredComplaints = complaints.filter(c => c.citizen_id !== null);

//     res.status(200).json(filteredComplaints);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getComplaintsForUserDistrict = async (req, res) => {
  try {
    let userDistrict = req.params.district;
    if (!userDistrict) {
      return res.status(400).json({ message: "User district not found" });
    }

    // Convert district name to ObjectId if needed
    if (!mongoose.Types.ObjectId.isValid(userDistrict)) {
      const districtDoc = await District.findOne({ 
        $or: [
          { district_name: userDistrict },
          { name: userDistrict }
        ]
      });
      if (!districtDoc) {
        return res.status(404).json({ message: "District not found" });
      }
      userDistrict = districtDoc._id;
    }

    // First get all complaints without filtering
    const complaints = await Complaint.find()
      .populate({
        path: 'property_id',
        select: 'house_no district_id',
        populate: { 
          path: 'district_id', 
          select: 'district_name' 
        }
      })
      .populate({
        path: 'citizen_id',
        select: 'name avatar district' // Include all needed citizen fields
      })
      .sort({ createdAt: -1 });

    // Manual filtering - more reliable than mongoose's match
    const filteredComplaints = complaints.filter(complaint => {
      // Check property district
      const propertyMatch = complaint.property_id?.district_id?._id.equals(userDistrict);
      
      // Check citizen district
      const citizenMatch = complaint.citizen_id?.district?.equals(userDistrict);

      return propertyMatch || citizenMatch;
    });

    // Format the response to ensure citizen name is included
    const response = filteredComplaints.map(complaint => ({
      ...complaint.toObject(),
      // Ensure citizen data is properly structured
      citizen_id: complaint.citizen_id ? {
        _id: complaint.citizen_id._id,
        name: complaint.citizen_id.name,
        avatar: complaint.citizen_id.avatar
      } : null,
      // Flatten some fields for easier frontend access
      citizenName: complaint.citizen_id?.name || 'Unknown',
      houseNo: complaint.property_id?.house_no,
      district: complaint.property_id?.district_id?.district_name
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ 
      message: "Failed to load complaints", 
      error: error.message 
    });
  }
};
// Reply to a complaint
exports.replyToComplaint = async (req, res) => {
  try {
    const { id } = req.params; // complaint id
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Reply is required" });

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { reply },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Reply sent", complaint: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reply", error: error.message });
  }
};
exports.getAllComplaintsAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: 'citizen_id',
        select: 'name avatar district',
        populate: { path: 'district', select: 'district_name' }
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id zone_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' },
          { path: 'zone_id', select: 'zone_name' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to load complaints", error: error.message });
  }
};
exports.getAllComplaintsForCitizenDetailed = async (req, res) => {
  try {
    const citizenId = req.query.citizenId;
    if (!citizenId) {
      return res.status(400).json({ message: 'citizenId query parameter is required' });
    }

    const complaints = await Complaint.find({ citizen_id: citizenId })
      .populate({
        path: 'citizen_id',
        select: 'name avatar',
      })
      .populate({
        path: 'property_id',
        select: 'house_no district_id branch_id zone_id',
        populate: [
          { path: 'district_id', select: 'district_name' },
          { path: 'branch_id', select: 'branch_name' },
          { path: 'zone_id', select: 'zone_name' },
        ],
      })
      .select('complaint_description createdAt citizen_id property_id')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load complaints', error: error.message });
  }
};
// exports.getDetailedComplaints = async (req, res) => {
//   try {
//     // 1. Fetch all complaints, with citizen populated for name & avatar
//     const complaints = await Complaint.find({})
//       .populate({
//         path: "citizen_id",
//         select: "name avatar",
//       })
//       .select("complaint_description createdAt citizen_id") // Omit property_id if you ONLY want current property
//       .sort({ createdAt: -1 });

//     // 2. For each complaint, get the *current* property of the citizen
//     const complaintsWithProperty = await Promise.all(
//       complaints.map(async (complaint) => {
//         // Find active property registered to this citizen
//         const citizenProperty = await Property.findOne({
//           citizen_id: complaint.citizen_id._id,
//           status: "active", // You can change this to your logic for current property
//         }).populate("district_id", "district_name");

//         return {
//           // Basic complaint details
//           _id: complaint._id,
//           citizen: {
//             _id: complaint.citizen_id._id,
//             name: complaint.citizen_id.name,
//             avatar: complaint.citizen_id.avatar || null,
//           },
//           description: complaint.complaint_description,
//           createdAt: complaint.createdAt,
//           // Attach current property info (or null if not found)
//           house_no: citizenProperty ? citizenProperty.house_no : null,
//           district: citizenProperty && citizenProperty.district_id ? citizenProperty.district_id.district_name : null,
//         };
//       })
//     );

//     res.json(complaintsWithProperty);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to load complaints",
//       error: error.message,
//     });
//   }
// };

exports.getDetailedComplaints = async (req, res) => {
  try {
    // 1. Fetch all complaints, with citizen populated for name & avatar
    const complaints = await Complaint.find({})
      .populate({
        path: "citizen_id",
        select: "name avatar",
      })
      .select("complaint_description createdAt citizen_id")
      .sort({ createdAt: -1 });

    // 2. For each complaint, get the most recent property of the citizen
    const complaintsWithProperty = await Promise.all(
      complaints.map(async (complaint) => {
        // Find the most recent property registered to this citizen
        const citizenProperty = await Property.findOne({
          citizen_id: complaint.citizen_id._id,
        })
          .sort({ createdAt: -1 })
          .populate("district_id", "district_name");

        return {
          // Basic complaint details
          _id: complaint._id,
          citizen: {
            _id: complaint.citizen_id._id,
            name: complaint.citizen_id.name,
            avatar: complaint.citizen_id.avatar || null,
          },
          description: complaint.complaint_description,
          createdAt: complaint.createdAt,
          // Attach most recent property info (or null if not found)
          house_no: citizenProperty ? citizenProperty.house_no : null,
          district:
            citizenProperty && citizenProperty.district_id
              ? citizenProperty.district_id.district_name
              : null,
        };
      })
    );

    res.json(complaintsWithProperty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load complaints",
      error: error.message,
    });
  }
};
// Updated getComplaintsByDistrict function
exports.getComplaintsByDistrict = async (req, res) => {
  try {
    const districtId = req.params.district;

    // ✅ Check if district exists
    const district = await District.findById(districtId).select('district_name name');
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }

    // ✅ Fetch complaints and populate citizen and property details
  const complaints = await Complaint.find()
  .populate({
    path: 'citizen_id', // Populate the citizen details
    select: 'name', // Only fetch the citizen's name
  })
  .populate({
    path: 'property_id',
    select: 'house_no district_id',
    populate: {
      path: 'district_id',
      select: 'district_name name',
    },
  })
  .sort({ createdAt: -1 });



    // ✅ Filter out complaints that do NOT match the district
    const filteredComplaints = complaints.filter(c =>
      c.citizen_id !== null || (
        c.property_id &&
        c.property_id.district_id &&
        c.property_id.district_id._id.toString() === districtId
      )
    );

    // ✅ Send response
    res.status(200).json({
      districtName: district.district_name || district.name || '',
      complaints: filteredComplaints
    });

  } catch (error) {
    console.error('Error in getComplaintsByDistrict:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message || 'Unknown error'
    });
  }
};




// Count complaints by district
exports.countComplaintsByDistrict = async (req, res) => {
  try {
    const districtId = req.params.district;
    if (!districtId) {
      return res.status(400).json({ message: "District ID is required" });
    }

    // Count complaints where either property or citizen belongs to the district
    const count = await Complaint.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "property_id",
          foreignField: "_id",
          as: "property"
        }
      },
      {
        $lookup: {
          from: "citizens",
          localField: "citizen_id",
          foreignField: "_id",
          as: "citizen"
        }
      },
      {
        $match: {
          $or: [
            { "property.district_id": mongoose.Types.ObjectId(districtId) },
            { "citizen.district": mongoose.Types.ObjectId(districtId) }
          ]
        }
      },
      {
        $count: "count"
      }
    ]);

    res.json({ count: count[0]?.count || 0 });
  } catch (error) {
    console.error("Error counting complaints:", error);
    res.status(500).json({ 
      message: "Failed to count complaints", 
      error: error.message 
    });
  }
};