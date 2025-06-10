const { encrypt, decrypt } = require("../encryption/encrypt");
const CreateFund = require("../models/createFundModel");
const Donator = require("../models/donatorModel");
const User = require("../models/userModel");


const handleCreateFund = async (req, res) => {
  try {
    const {
      country,
      postcode,
      fundCategory,
      fundraiseTitle,
      fundraiseStory,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      upiId,
      totalAmountRaised,
    } = req.body;

    const userId = req.user.id;

    if (
      !country ||
      !postcode ||
      !fundCategory ||
      !fundraiseTitle ||
      !fundraiseStory ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !bankName ||
      !upiId ||
      !totalAmountRaised
    ) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "QR code image is required" });
    }

    const qrCodeImage = req.file.path;

    const encryptedAccountNumber = encrypt(accountNumber);
    const encryptedIFSC = encrypt(ifscCode);

    const newFund = new CreateFund({
      userId,
      country,
      postcode,
      fundCategory,
      fundraiseTitle,
      fundraiseStory,
      donationAmount: 0,
      accountHolderName,
      accountNumber: encryptedAccountNumber,
      ifscCode: encryptedIFSC,
      bankName,
      upiId,
      qrCodeImage,
      totalAmountRaised,
    });

    await newFund.save();

    res.status(201).json({
      msg: "Fundraising created successfully!",
      fund: newFund,
    });
  } catch (error) {
    console.error("Error creating fund:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getAllFunds = async (req, res) => {
  try {
    const funds = await CreateFund.find()
      .populate("donators")
      .sort({ createdAt: -1 });

    const decryptedFunds = funds.map((fund) => {
      return {
        ...fund._doc,
        accountNumber: decrypt(fund.accountNumber),
        ifscCode: decrypt(fund.ifscCode),
      };
    });

    res.status(200).json({
      success: true,
      count: decryptedFunds.length,
      funds: decryptedFunds,
    });
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getFundById = async (req, res) => {
  const { id } = req.params;

  try {
    const fund = await CreateFund.findById(id).populate("donators");
    if (!fund) {
      return res.status(404).json({ msg: "Fund not found" });
    }

    const decryptedFund = {
      ...fund._doc,
      accountNumber: decrypt(fund.accountNumber),
      ifscCode: decrypt(fund.ifscCode),
    };

    res.status(200).json({
      success: true,
      fund: decryptedFund,
    });
  } catch (error) {
    console.error("Error fetching fund by ID:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getDonatorsByFundId = async (req, res) => {
  const { fundId } = req.params;

  try {
    const donators = await Donator.find({ fundId })
      .populate("userId", "name email") // Only include name and email of the user
      .sort({ donatedAt: -1 });         // Optional: newest donations first

    if (!donators.length) {
      return res.status(404).json({ msg: "No donators found for this fund" });
    }

    res.status(200).json({
      success: true,
      count: donators.length,
      donators,
    });
  } catch (error) {
    console.error("Error fetching donators by fund ID:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
 handleCreateFund,
  getAllFunds,
  getFundById,
  getDonatorsByFundId,
};
