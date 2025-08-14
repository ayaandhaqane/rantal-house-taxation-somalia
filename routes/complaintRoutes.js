const express = require('express');
const router = express.Router();
const { authenticate,requireAdmin } = require('../middleware/authenticate');
const {
  getAllComplaints,
  createComplaint,
  getDetailedComplaints,
  getComplaintsForUserDistrict,
  // countUnreadComplaints,
  markComplaintAsRead,
  replyToComplaint,
  getAllComplaintsAdmin,
  getAllComplaintsForCitizenDetailed,
  getComplaintsByDistrict,
  countComplaintsByDistrict
} = require('../controllers/complaintController');

router.get('/', getAllComplaints);
router.post('/create', createComplaint);
router.get('/detailed', getDetailedComplaints);
// router.get('/citizen-detailed', getAllComplaintsForCitizenDetailed);
router.get('/all-admin', authenticate,requireAdmin, getAllComplaintsAdmin);

// Complaints filtered by district
router.get('/bydistrict/:district', authenticate, getComplaintsForUserDistrict);
//how much compient each dostrict
router.get('/count-by-district/:district', authenticate, countComplaintsByDistrict);
// routes/complaintRoutes.js
router.get('/by-district/:district', getComplaintsByDistrict);

// router.get('/count-unread', countUnreadComplaints);
router.put('/mark-read/:id', markComplaintAsRead);

router.post('/:id/reply', replyToComplaint);

module.exports = router;
