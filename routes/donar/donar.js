const express = require("express");
const router = express.Router();
const parser = require("../../middleware/upload");
const {donateAmount} = require("../../controllers/donarController");
const authMiddleware  = require("../../middleware/authMiddleware");
router.post(
  "/donate",
  authMiddleware,
  parser.single("proofImage"), 
  donateAmount
);

module.exports=router