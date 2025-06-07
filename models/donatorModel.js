const mongoose = require("mongoose");

const donatorSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    }, 
    fundId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "CreateFund", 
      required: true 
    }, 
    amount: { 
      type: Number, 
      required: true 
    },
    donatedAt: { 
      type: Date, 
      default: Date.now 
    },
     proofImage: {
      type: String,
      required:true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Donator = mongoose.model("Donator", donatorSchema);

module.exports = Donator;
