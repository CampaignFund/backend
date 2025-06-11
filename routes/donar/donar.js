const express = require("express");
const router = express.Router();
const {donateAmount} = require("../../controllers/donarController");
const upload = require("../../middleware/cloundinaryUpload");
const optionalAuthenticationCookie = require("../../middleware/optionalMiddleware");
router.post(
  "/donate",
  optionalAuthenticationCookie("token"),
  upload.single("proofImage"), 
  donateAmount
);

module.exports=router