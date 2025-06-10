const express = require("express");
const router = express.Router();
const {donateAmount} = require("../../controllers/donarController");
const upload = require("../../middleware/cloundinaryUpload");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware");
router.post(
  "/donate",
  checkForAuthenticationCookie("token"),
  upload.single("proofImage"), 
  donateAmount
);

module.exports=router