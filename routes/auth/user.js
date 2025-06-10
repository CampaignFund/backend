const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  handleResetPassword,
  handleLogout,
} = require("../../controllers/userController");
const upload = require("../../middleware/cloundinaryUpload");

router.post("/signup",  upload.single("profilePhoto"),signup);
router.post("/login", login);
router.post("/logout", handleLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", handleResetPassword);


module.exports = router;  