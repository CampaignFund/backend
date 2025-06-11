const express = require("express");
const { getPendingFunds, approveFund, rejectFund } = require("../../controllers/adminController");
const router = express.Router();

router.get("/fund-raise/pending-funds",  getPendingFunds);
router.put("/fund-raise/approve-fund/:id",  approveFund);
router.delete("/fund-raise/reject-fund/:id",  rejectFund);

module.exports = router;
