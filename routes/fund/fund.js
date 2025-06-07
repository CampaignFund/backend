const express = require("express");
const router = express.Router();
const parser = require("../../middleware/upload");
const {
  createFund,
  getAllFunds,
  getFundById,
  getDonatorsByFundId,
} = require("../../controllers/fundController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post(
  "/fundraise",
  authMiddleware,
  parser.single("qrCodeImage"),
  createFund
);

router.get("/fund-list", getAllFunds);
router.get("/fund-by-id/:id", getFundById);
router.get("/donar-by-fundId/:fundId", getDonatorsByFundId);

module.exports = router;
