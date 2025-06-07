const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  resendOTP,
  forgotPassword,
  handleResetPassword,
  verifyOTP
} = require("../../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", handleResetPassword);
router.post("/verify-email", verifyOTP);
router.post("/resend-otp", resendOTP);


module.exports = router;  