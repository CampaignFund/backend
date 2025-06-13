const express = require("express");
const upload = require("../../middleware/cloundinaryUpload");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
const { handleCreateFund, getAllFunds, getFundById, getDonatorsByFundId, getTrendingFunds } = require("../../controllers/fundController");
const router = express.Router();

router.post(
  "/create-fundraise",
  checkForAuthenticationCookie("token"),
   upload.fields([
    { name: "qrCodeImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  handleCreateFund
);

router.get("/fund-list", getAllFunds);
router.get("/trending", getTrendingFunds);
router.get("/fund-list/:id", getFundById);
router.get("/donar-by-fundId/:fundId", getDonatorsByFundId);

module.exports = router;
