const StatusChangeRequest = require('../models/StatusChangeRequest');
const Property = require('../models/Property');

exports.approveStatusChange = async (req, res) => {
    const { requestId, approvalStatus } = req.body;
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
  
    try {
      const request = await StatusChangeRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  

      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'This request has already been processed' });
      }
  
      if (approvalStatus === 'approved') {
        const property = await Property.findById(request.property_id);
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }
  
        property.status = request.requestedStatus;
        await property.save();
  
        request.status = 'approved';
        request.approval_date = new Date();
        await request.save();
  
        res.status(200).json({ message: `Property status updated to ${request.requestedStatus}` });
      } else {
        request.status = 'rejected';
        await request.save();
  
        res.status(200).json({ message: 'Status change request rejected' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error approving status change', error: err.message });
    }
  };


// This function now fetches details for both request types
exports.getAllStatusChangeRequests = async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
  
    try {
      const requests = await StatusChangeRequest.find()
        .populate('property_id', 'house_no') // For status changes
        .populate('citizen_id', 'name')      // For delete requests
        .populate('employee_id', 'userId')
        .sort({ createdAt: -1 });
  
      res.status(200).json(requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
  };

  // New function to approve or reject a citizen deletion
  exports.approveCitizenDeletion = async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const { requestId, approvalStatus } = req.body;

    try {
        const request = await StatusChangeRequest.findById(requestId);
        if (!request || request.requestType !== 'deleteCitizen') {
            return res.status(404).json({ message: 'Deletion request not found.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'This request has already been processed.' });
        }

        // If approved, delete the citizen
        if (approvalStatus === 'approved') {
            await Citizen.findByIdAndDelete(request.citizen_id);
            request.status = 'approved';
        } else {
            request.status = 'rejected';
        }
        
        await request.save();
        res.status(200).json({ message: `Deletion request has been ${approvalStatus}.` });

    } catch (err) {
        console.error('Error processing citizen deletion:', err);
        res.status(500).json({ message: 'Error processing deletion request.', error: err.message });
    }
};