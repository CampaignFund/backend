const express = require("express");
const {
  getUserProfileWithFundAndDonations,
} = require("../../controllers/userController");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const router = express.Router();

router.get(
  "/profile",
  checkForAuthenticationCookie("token"),
  getUserProfileWithFundAndDonations
);

module.exports = router;
