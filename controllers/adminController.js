const CreateFund = require("../models/createFundModel");

const getPendingFunds = async (req, res) => {
  try {
    const pendingFunds = await CreateFund.find({ isApproved: false });
    res.status(200).json({ pendingFunds });
  } catch (error) {
    res.status(500).json({ msg: "Server error while fetching pending funds" });
  }
};

const approveFund = async (req, res) => {
  try {
    const fundId = req.params.id;
    const fund = await CreateFund.findByIdAndUpdate(
      fundId,
      { isApproved: true },
      { new: true }
    );

    if (!fund) {
      return res.status(404).json({ msg: "Fund not found" });
    }

    res.status(200).json({ msg: "Fund approved successfully", fund });
  } catch (error) {
    res.status(500).json({ msg: "Server error while approving fund" });
  }
};


const rejectFund = async (req, res) => {
  try {
    const fundId = req.params.id;


    const fund = await CreateFund.findByIdAndDelete(fundId);

    if (!fund) {
      return res.status(404).json({ msg: "Fund not found" });
    }
    res.status(200).json({ msg: "Fund rejected successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error while rejecting fund" });
  }
};

module.exports = {
  getPendingFunds,
  approveFund,
  rejectFund,
};
