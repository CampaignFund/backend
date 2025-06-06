const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createPayload = require("../utils/payload");
const {
  sendResetPassword,
  sendOtpForEmailVerification,
} = require("../service/emailService");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const isValidPassword = (password) => {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[\W_]/.test(password) &&
    password.length >= 6 &&
    password.length <= 18
  );
};

const signup = async (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !email || !password || !phone) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists. Please log in." });
    }

    if (!isValidPassword(password)) {
      return res.status(401).json({
        message:
          "Password must be 12-18 characters long, include uppercase, lowercase, digit, special character, and not contain your name.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    

    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      isVerifiedEmail: false,
      otp: otp,
    });
    const otpSent = await sendOtpForEmailVerification(name,email, otp);
    if (!otpSent) {
      return res.status(500).json({ msg: "Failed to send OTP" });
    }

    return res.status(201).json({
      msg: "Signup successful! OTP sent to your phone.",
      userId: newUser._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Internal server error from user signup: ${error}` });
  }
};

const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp) {
      return res.status(401).json({ msg: "Invalid OTP" });
    }

    user.isVerifiedEmail = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({ msg: "Email verified successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Server error from OTP verification: ${error.message}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ msg: "Password not matched" });
    }

    const payload = createPayload(user);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error) {
    return res.status(500).json({ msg: `Server error: ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailSent = await sendResetPassword(user.name, user.email, resetLink);

    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send reset email" });
    }

    return res.status(200).json({
      msg: "Reset link sent to your email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Server error from forgot password: ${error.message}`,
    });
  }
};

const handleResetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const decoded = jwt.verify(resetToken, process.env.SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(401).json({
        message:
          "Password must be 12-18 characters long, include uppercase, lowercase, digit, special character, and not contain your name.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Server error from handleResetPassword: ${error}` });
  }
};

module.exports = {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  handleResetPassword,
};
