const {
  sendFundApprovalMailToAdmin,
  sendFundCreationMailToUser,
} = require("../emailService/emailService");
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
      bankCode,
      totalAmountRaised,
    } = req.body;
    const user = req.user;
    const userId = req.user?.id;

    if (
      !country ||
      !postcode ||
      !fundCategory ||
      !fundraiseTitle ||
      !fundraiseStory ||
      !totalAmountRaised
    ) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const qrCodeImage = req.files?.qrCodeImage?.[0]?.path || null;
    const coverImage = req.files?.coverImage?.[0]?.path || null;

    const encryptedAccountNumber = accountNumber
      ? encrypt(accountNumber)
      : null;
    const encryptedIFSC = ifscCode ? encrypt(ifscCode) : null;

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
      bankCode,
      bankName,
      upiId,
      qrCodeImage,
      coverImage,
      isApproved: false,
      totalAmountRaised,
    });

    await newFund.save();
    await sendFundApprovalMailToAdmin({
      fund: newFund,
      user: {
        name: req.user.fullName,
        email: req.user.email,
      },
    });

    await sendFundCreationMailToUser({
      fund: newFund,
      user: {
        name: req.user.fullName,
        email: req.user.email,
      },
    });

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
    const { search } = req.query;

    const filter = { isApproved: true };

    if (search) {
      filter.$or = [
        { fundCategory: { $regex: search, $options: "i" } },
        { fundraiseTitle: { $regex: search, $options: "i" } },
      ];
    }

    const funds = await CreateFund.find(filter)
      .populate("donators")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    const decryptedFunds = funds.map((fund) => ({
      ...fund._doc,
      accountNumber: fund.accountNumber ? decrypt(fund.accountNumber) : null,
      ifscCode: fund.ifscCode ? decrypt(fund.ifscCode) : null,
    }));

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
    const fund = await CreateFund.findOne({
      _id: id,
      isApproved: true,
    })
      .populate("donators")
      .populate("userId", "fullName email");
    if (!fund) {
      return res.status(404).json({ msg: "Fund not found or not approved" });
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
      .sort({ donatedAt: -1 }); // Optional: newest donations first

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
