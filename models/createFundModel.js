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
    fundRaisingFor: {
      
      type: String,
      enum: ["yourself", "someone_else", "charity"],
      required: true,
    },
    donationAmount: {
      type: Number,
      required: true,
      min: [1, "Donation amount must be at least 1"],
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
      ref: "User",
      required: true, 
    },
  },
  { timestamps: true }
);

const CreateFund = mongoose.model("CreateFund", createFundSchema);

module.exports = CreateFund;
