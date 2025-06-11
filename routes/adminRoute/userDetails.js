const express = require("express");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const { authorizeRoles } = require("../../middleware/roleMiddleware");
const {
  getAllUsers,
  getAllFundraisers,
} = require("../../controllers/userDetails");
const router = express.Router();

router.get(
  "/users",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  getAllUsers
);
router.get(
  "/fundraisers",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin"]),
  getAllFundraisers
);

module.exports = router;
