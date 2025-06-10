const express = require("express");
const upload = require("../../middleware/cloundinaryUpload");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const { handleCreateFund, getAllFunds, getFundById, getDonatorsByFundId } = require("../../controllers/fundController");
const router = express.Router();

router.post(
  "/create-fundraise",
  checkForAuthenticationCookie("token"),
  upload.single("qrCodeImage"),
  handleCreateFund
);

router.get("/fund-list", getAllFunds);
router.get("/fund-by-id/:id", getFundById);
router.get("/donar-by-fundId/:fundId", getDonatorsByFundId);

module.exports = router;
