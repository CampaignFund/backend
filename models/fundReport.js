const mongoose = require("mongoose");

const fundReportSchema = new mongoose.Schema(
  {
    fundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreateFund",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FundReport", fundReportSchema);
