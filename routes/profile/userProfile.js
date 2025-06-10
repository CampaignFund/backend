const express = require("express");
const {
  getUserProfileWithFundAndDonations,
  updateUserProfile,
} = require("../../controllers/userController");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const upload = require("../../middleware/cloundinaryUpload");
const router = express.Router();

router.get(
  "/profile",
  checkForAuthenticationCookie("token"),
  getUserProfileWithFundAndDonations
);
router.put(
  "/update-profile",
  checkForAuthenticationCookie("token"),
  upload.single("profilePhoto"),
  updateUserProfile
);

module.exports = router;
