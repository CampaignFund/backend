const express = require("express");
const router = express.Router();
const {
  createFund,
  getAllDonors,
  getDonorById,
} = require("../../controllers/fundController");
const auth = require("../../middleware/authMiddleware");
router.post("/createFund", auth, createFund);
router.get("/donors", getAllDonors);
router.get("/donors/:id", getDonorById);

module.exports = router;
