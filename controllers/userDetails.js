const CreateFund = require("../models/createFundModel");
const User = require("../models/userModel");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getAllFundraisers = async (req, res) => {
  try {
    const funds = await CreateFund.find({})
      .populate("userId", "fullName email")
      .populate("donators", "fullName email amount donatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: funds.length,
      funds,
    });
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
    getAllFundraisers,
    getAllUsers
}