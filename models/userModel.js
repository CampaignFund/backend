const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "pending", "deleted"],
      default: "active",
    },
    fullName: {
      type: String,
    },
    phone: {
      type: String,
       default: null,
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
