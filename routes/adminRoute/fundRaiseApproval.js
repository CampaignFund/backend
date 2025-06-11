const express = require("express");
const {
  getPendingFunds,
  approveFund,
  rejectFund,
} = require("../../controllers/adminController");
const { authorizeRoles } = require("../../middleware/roleMiddleware");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const router = express.Router();

router.get(
  "/fund-raise/pending-funds",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  getPendingFunds
);
router.put(
  "/fund-raise/approve-fund/:id",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  approveFund
);
router.delete(
  "/fund-raise/reject-fund/:id",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  rejectFund
);

module.exports = router;
