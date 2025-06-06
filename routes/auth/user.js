const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const {
  signup,
  login,
  forgotPassword,
  handleResetPassword,
  verifyOTP
} = require("../../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", handleResetPassword);
router.post("/verify-email", verifyOTP);

module.exports = router;  