const CreateFund = require("../models/createFundModel");
const Donator = require("../models/donatorModel");
const User = require("../models/userModel");
const createFund = async (req, res) => {
  try {
    const {
      country,
      postcode,
      fundCategory,
      fundRaisingFor,
      donationAmount,
      fundraiseTitle,
      fundraiseStory,
    } = req.body;
    const userId = req.user.id;

    if (
      !country ||
      !postcode ||
      !fundCategory ||
      !fundRaisingFor ||
      !donationAmount ||
      !fundraiseTitle ||
      !fundraiseStory
    ) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const newFund = new CreateFund({
      userId,
      country,
      postcode,
      fundCategory,
      fundRaisingFor,
      donationAmount,
      fundraiseTitle,
      fundraiseStory,
    });

    await newFund.save();
    const newDonor = new Donator({
      userId,
      fundId: newFund._id,
      amount: donationAmount,
    });

    await newDonor.save();

    res
      .status(201)
      .json({
        msg: "Fundraising created successfully!",
        fund: newFund,
        donor: newDonor,
      });
  } catch (error) {
    console.error("Error creating fund:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const donors = await Donator.find()
      .populate("userId", "name email")
      .populate("fundId", "fundraiseTitle");

    return res.status(200).json({ success: true, donors });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const getDonorById = async (req, res) => {
  const { id } = req.params;

  try {
    const donor = await Donator.findById(id)
      .populate("userId", "name email")
      .populate("fundId", "fundraiseTitle");

    if (!donor) {
      return res.status(404).json({ success: false, msg: "Donor not found" });
    }

    return res.status(200).json({ success: true, donor });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  createFund,
  getAllDonors,
  getDonorById,
};
