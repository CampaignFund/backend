const CreateFund = require("../models/createFundModel"); 
const Donator = require("../models/donatorModel");
const User = require('../models/userModel')
const donateAmount = async (req, res) => {
  try {
    const { fundId, amount } = req.body;
    const userId = req.user.id;

    if (!fundId || !amount) {
      return res.status(400).json({ msg: "Fund ID and amount are required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Proof of donation image is required" });
    }

    const proofImage = req.file.path;

    const fund = await CreateFund.findById(fundId);
    if (!fund) return res.status(404).json({ msg: "Fund not found" });

    const newDonor = new Donator({
      userId,
      fundId,
      amount,
      proofImage,
    });

    await newDonor.save();

    fund.donationAmount += amount;
    fund.donators.push(newDonor._id);
    await fund.save();

    res.status(201).json({
      msg: "Donation successful!",
      donor: newDonor,
      fund,
    });
  } catch (error) {
    console.error("Error donating amount:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { donateAmount };
