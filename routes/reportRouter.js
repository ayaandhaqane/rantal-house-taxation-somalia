// routes/reportRouter.js
const express = require('express');
const router = express.Router();
const {
    getCitizensByOwnDistrict,
    getTotalCitizens,
    getActiveCitizens,
    getInactiveCitizens,
    getPendingCitizens,
    getTotalCitizensByDistrict,
    getActiveCitizensByDistrict,
    getInactiveCitizensByDistrict,
    getPendingCitizensByDistrict,

    getTotalCitizensByBranch,
    getActiveCitizensByBranch,
    getInactiveCitizensByBranch,
    getPendingCitizensByBranch,

    getTotalCitizensByZone,
    getActiveCitizensByZone,
    getInactiveCitizensByZone,
    getPendingCitizensByZone,
    getRequestsByDistrict,

    getCitizensCountByDistrict,
    getActiveInactiveCitizensByDistrict,
    getCitizensCountByBranch,
    getCitizensStatusByBranch,

    getDetailedBreakdown,

    getCitizensByDistrictFull,
    getCitizensByBranchFull,
    getCitizensByAllDistrictsFull,
    getRequestStatusCounts,


// Complient report
    getTotalComplaints,
    getRepliedComplaints,
    getUnrepliedComplaints,
    getComplaintStatusPie,
    getComplaintsCountByDistrict,
    getComplaintsCountByBranch,
    getGroupedComplaints,



    // payment report
    getPaymentReport,
    countCitizensWithDueTax,
    getPaymentBreakdownByDistrict,
    getPaidAndDueCitizens,
    getTotalCollectedByDistrict,
    getTotalCollectedByBranch,
    getPaidUnpaidByDistrict,
    getPaidUnpaidByBranch,

    getPaymentTableByDistrict,
    getPaymentTableByBranch,
    getAllPayments,
    getPaymentsByDistrict,
    getPaymentsByBranch,

    // Dashboard dynamic report 
    getDistrictPaymentsByYear,
    getTotalPaymentsByYear,
    getActiveAndInactiveCitizens,
    // getPaidAndDueCitizens,
  } = require('../controllers/reportController');
  
// ✅ No `authenticate` middleware applied here
router.get('/my-district', getCitizensByOwnDistrict);

// Route to get total citizens
router.get('/total-citizens', getTotalCitizens);

// Route to get active citizens
router.get('/active-citizens', getActiveCitizens);

// Route to get inactive citizens
router.get('/inactive-citizens', getInactiveCitizens);

// Route to get pending citizens
router.get('/pending-citizens', getPendingCitizens);

router.get('/citizens/by-district/:districtId', getTotalCitizensByDistrict);

router.get('/active-citizens/by-district/:districtId', getActiveCitizensByDistrict);
router.get('/inactive-citizens/by-district/:districtId', getInactiveCitizensByDistrict);
router.get('/pending-citizens/by-district/:districtId', getPendingCitizensByDistrict);


router.get('/citizens/by-branch/:branchId', getTotalCitizensByBranch);
router.get('/active-citizens/by-branch/:branchId', getActiveCitizensByBranch);
router.get('/inactive-citizens/by-branch/:branchId', getInactiveCitizensByBranch);
router.get('/pending-citizens/by-branch/:branchId', getPendingCitizensByBranch);
router.get('/requests-by-district', getRequestsByDistrict);


router.get('/citizens/by-zone/:zoneId', getTotalCitizensByZone);
router.get('/active-citizens/by-zone/:zoneId', getActiveCitizensByZone);
router.get('/inactive-citizens/by-zone/:zoneId', getInactiveCitizensByZone);
router.get('/pending-citizens/by-zone/:zoneId', getPendingCitizensByZone);


router.get('/citizens-count-by-district', getCitizensCountByDistrict);
router.get('/active-inactive-citizens/by-district', getActiveInactiveCitizensByDistrict);

router.get('/citizens-count-by-branch/:districtId', getCitizensCountByBranch);
// router.get('/status-by-branch/:districtId', getStatusByBranch);
router.get('/citizens-status-by-branch/:districtId', getCitizensStatusByBranch);

// When no district specified (all districts)
router.get('/detailed-breakdown', getDetailedBreakdown);

// When district specified
router.get('/detailed-breakdown/:districtId', getDetailedBreakdown);


router.get("/citizens/full", getCitizensByAllDistrictsFull);
router.get("/citizens/full/by-district/:districtId", getCitizensByDistrictFull);
router.get("/citizens/full/by-branch/:branchId", getCitizensByBranchFull);
router.get("/request-status-counts", getRequestStatusCounts);

// Summary counts
router.get('/complaints/total', getTotalComplaints);
router.get('/complaints/replied', getRepliedComplaints);
router.get('/complaints/unreplied', getUnrepliedComplaints);

// Pie chart
router.get('/complaints/status-pie', getComplaintStatusPie);

// Bar chart
router.get('/complaints/count-by-district', getComplaintsCountByDistrict);

// Table grouped
router.get('/complaints/grouped', getGroupedComplaints);
router.get('/complaints/count-by-branch/:districtId', getComplaintsCountByBranch);


//Payment report
// Payment Report - Filtered by date range and status
router.get('/payment-report', getPaymentReport);

// routes/taxCollectionRoutes.js
router.get('/due-citizens', countCitizensWithDueTax);

router.get('/payment-breakdown', getPaymentBreakdownByDistrict);
// Add the new route to handle fetching paid and unpaid amounts for the pie chart
// Add new route to get paid and due citizens
router.get('/paid-and-due-citizens', getPaidAndDueCitizens);
router.get('/total-collected-by-district', getTotalCollectedByDistrict);
router.get('/total-collected-by-branch', getTotalCollectedByBranch);


// Route for fetching paid and unpaid citizens by district
router.get('/paid-unpaid-by-district', getPaidUnpaidByDistrict);
router.get('/report/paid-unpaid-by-branch', getPaidUnpaidByBranch);


//Breakdown table
router.get('/payment-table-by-district', getPaymentTableByDistrict);
router.get("/payment-table-by-branch", getPaymentTableByBranch);

//export table
router.get('/payments/all', getAllPayments);
router.get("/payments/by-district/:districtId", getPaymentsByDistrict);
router.get("/payments/by-branch/:branchId", getPaymentsByBranch);


// Dashboard dynamic report 
router.get('/district-payments-by-year', getDistrictPaymentsByYear);
router.get('/total-payments-by-year', getTotalPaymentsByYear);
router.get('/active-inactive-citizens', getActiveAndInactiveCitizens);
router.get('/paid-and-due-citizens', getPaidAndDueCitizens);

module.exports = router;