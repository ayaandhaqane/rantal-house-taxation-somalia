const StatusChangeRequest = require('../models/StatusChangeRequest');
const Property = require('../models/Property');
const User = require('../models/User');
const Citizen = require('../models/Citizen');


exports.requestStatusChange = async (req, res) => {
    const { house_no, requestedStatus } = req.body;
    const employeeId = req.user._id;
  
    try {
      const property = await Property.findOne({ house_no });
      if (!property) {
        return res.status(404).json({ message: 'Property not found with the given house number.' });
      }
  
      // This creates the request.
      const newRequest = new StatusChangeRequest({
        requestType: 'statusChange',
        property_id: property._id,
        requestedStatus,
        employee_id: employeeId,
        status: 'pending'
      });
  
      property.status = "pending";
      await property.save();
      await newRequest.save(); 

      
      res.status(200).json({
        message: 'Status change request sent to admin for approval.',
        request: newRequest
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error processing your request.' });
    }
  };


// Controller to create a new delete request
exports.createDeleteRequest = async (req, res) => {
    const { citizenId } = req.body;
    try {
      const citizen = await Citizen.findById(citizenId);
      if (!citizen) return res.status(404).json({ message: 'Citizen not found.' });
      
         // Fetch the property for this citizen
         const property = await Property.findOne({ citizen_id: citizenId });
         if (!property) return res.status(404).json({ message: 'Property not found for this citizen.' });
   
         // Use house_no in details
         const newRequest = new StatusChangeRequest({
           requestType: 'deleteCitizen',
           details: property.house_no, 
           citizen_id: citizenId,
           employee_id: req.user._id,
         });

      await newRequest.save();
      res.status(200).json({ message: 'Delete request sent successfully.' });
    } catch (error) {
        console.error('Error creating delete request:', error);
        res.status(500).json({ message: 'Server error while creating delete request.' });
    }
};