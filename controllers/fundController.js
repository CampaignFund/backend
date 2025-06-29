const {
  sendFundApprovalMailToAdmin,
  sendFundCreationMailToUser,
} = require("../emailService/emailService");
const CreateFund = require("../models/createFundModel");
const Donator = require("../models/donatorModel");
const fundReport = require("../models/fundReport");
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
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { fullName, email, cnicImage, cityName, phone } = user;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !cnicImage?.trim() ||
      !cityName?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        msg: "Please complete your profile before creating a fund. Required fields: fullName, email, CNIC image, city, phone.",
      });
    }

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

    const coverImage = req.file ? req.file.path : undefined;

    const newFund = new CreateFund({
      userId,
      country,
      postcode,
      fundCategory,
      fundraiseTitle,
      fundraiseStory,
      donationAmount: 0,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankCode,
      bankName,
      upiId,
      coverImage,
      isApproved: false,
      totalAmountRaised,
    });

    await newFund.save();

    await Promise.all([
      sendFundApprovalMailToAdmin({
        fund: newFund,
        user: {
          name: req.user.fullName,
          email: req.user.email,
        },
      }),
      sendFundCreationMailToUser({
        fund: newFund,
        user: {
          name: req.user.fullName,
          email: req.user.email,
        },
      }),
    ]);

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
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: funds.length,
      funds: funds,
    });
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getTrendingFunds = async (req, res) => {
  try {
    const approvedFunds = await CreateFund.find({ isApproved: true })
      .populate("donators")
      .populate("userId");

    const filteredFunds = approvedFunds.filter((fund) => {
      const donationAmount = fund.donationAmount || 0;
      const totalRaised = fund.totalAmountRaised || 0;

      return (
        totalRaised > 0 &&
        (donationAmount >= totalRaised / 2 ||
          donationAmount >= totalRaised / 3 ||
          donationAmount >= totalRaised / 4)
      );
    });

    const sortedFunds = filteredFunds.sort(
      (a, b) => (b.donationAmount || 0) - (a.donationAmount || 0)
    );
    const top4Funds = sortedFunds.slice(0, 4);

    res.status(200).json({
      success: true,
      count: top4Funds.length,
      trendingFunds: top4Funds,
    });
  } catch (error) {
    console.error("Error fetching trending funds:", error);
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
      .populate("userId");

    if (!fund) {
      return res.status(404).json({ msg: "Fund not found or not approved" });
    }

    const reports = await fundReport
      .find({ fundId: id })
      .sort({ createdAt: -1 })
      .select("description image createdAt");

    res.status(200).json({
      success: true,
      fund: fund,
      reports,
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
      .populate("userId", "name email")
      .sort({ donatedAt: -1 });
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

const deleteMyFund = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const fund = await CreateFund.findById(id);

    if (!fund) {
      return res.status(404).json({ msg: "Fund not found" });
    }

    if (fund.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Unauthorized to delete this fund" });
    }

    await CreateFund.findByIdAndDelete(id);
    res.status(200).json({ success: true, msg: "Fund deleted successfully" });
  } catch (error) {
    console.error("Error deleting fund:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const adminDeleteFund = async (req, res) => {
  const { id } = req.params;

  try {
    const fund = await CreateFund.findById(id);
    if (!fund) {
      return res.status(404).json({ msg: "Fund not found" });
    }

    await CreateFund.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, msg: "Fund deleted by admin successfully" });
  } catch (error) {
    console.error("Admin delete fund error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  handleCreateFund,
  getAllFunds,
  getFundById,
  getDonatorsByFundId,
  getTrendingFunds,
  deleteMyFund,
  adminDeleteFund,
};
