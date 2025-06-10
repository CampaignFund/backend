const mongoose = require("mongoose");

const createFundSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
    },
    fundCategory: {
      type: String,
      enum: [
        "animal",
        "business",
        "community",
        "competition",
        "creative",
        "education",
        "emergencies",
        "environment",
        "events",
        "faith",
        "family",
        "funerals_memorials",
        "medical",
        "monthly_bills",
        "newly_weds",
        "other",
        "sports",
        "travel",
        "ukraine_relief",
        "volunteer",
        "wishes",
      ],
      required: true,
    },

    fundraiseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    fundraiseStory: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    accountHolderName: {
      type: String,
    },
    accountNumber: {
      type: Object,
    },
    ifscCode: {
      type: Object,
    },

    bankName: {
      type: String,
      trim: true,
    },

    upiId: {
      type: String,
      trim: true,
    },

    qrCodeImage: {
      type: String,
      validate: {
        validator: function (value) {
          return value.startsWith("http");
        },
        message: "QR code image must be a valid image URL",
      },
    },
    donationAmount: {
      type: Number,
      default: 0,
      min: 500,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    totalAmountRaised: {
      type: Number,
      min: [1, "Donation amount must be at least 1"],
    },
    donators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donator",
      },
    ],
  },
  { timestamps: true }
);

const CreateFund = mongoose.model("CreateFund", createFundSchema);

module.exports = CreateFund;
