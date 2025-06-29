const express = require("express");
const {
  getUserProfileWithFundAndDonations,
  updateUserProfile,
  getUserCreatedFunds,
} = require("../../controllers/userController");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const upload = require("../../middleware/cloundinaryUpload");
const {
  handleRequestDeletion,
} = require("../../controllers/deletionController");
const router = express.Router();

router.get(
  "/profile",
  checkForAuthenticationCookie("token"),
  getUserProfileWithFundAndDonations
);

router.get(
  "/my-funds",
  checkForAuthenticationCookie("token"),
  getUserCreatedFunds
);

router.put(
  "/update-profile",
  checkForAuthenticationCookie("token"),
  upload.single("cnicImage"),
  updateUserProfile
);

router.post(
  "/account-deletion/request",
  checkForAuthenticationCookie("token"),
  handleRequestDeletion
);

module.exports = router;
