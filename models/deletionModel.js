const mongoose = require("mongoose");

const deletionRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    email: String,
    fullName: String,
    donatedFunds: [
      {
        fundTitle: String,
        amount: Number,
        donatedAt: Date,
      },
    ],

    createdFunds: [
      {
        fundraiseTitle: String,
        fundCategory: String,
        totalAmountRaised: String,
        createdAt: Date,
        isApproved: Boolean,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const DeletionRequest = mongoose.model(
  "DeletionRequest",
  deletionRequestSchema
);
module.exports = DeletionRequest;
