const CreateFund = require("../models/createFundModel");
const DeletionRequest = require("../models/deletionModel");
const Donator = require("../models/donatorModel");
const User = require("../models/userModel");


const handleRequestDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const existingRequest = await DeletionRequest.findOne({ userId: user._id, status: "pending" });
    if (existingRequest) return res.status(400).json({ msg: "Deletion request already pending" });

    const deletionReq = new DeletionRequest({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    });

    await deletionReq.save();
    res.status(201).json({ msg: "Deletion request submitted successfully" });
  } catch (error) {
    console.error("Error submitting deletion request:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAllPendingDeletions = async (req, res) => {
  try {
    const pendingRequests = await DeletionRequest.find({status:"pending"})
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    const enrichedRequests = await Promise.all(
      pendingRequests.map(async (request) => {
        const userId = request.userId?._id;

        const donatedFunds = await Donator.find({ userId })
          .populate("fundId", "fundraiseTitle donationAmount")
          .lean();

        const createdFunds = await CreateFund.find({ userId })
          .select("fundraiseTitle donationAmount totalAmountRaised isApproved")
          .lean();

        return {
          ...request._doc,
          fullName: request.userId?.fullName || request.fullName,
          email: request.userId?.email || request.email,
          donatedFunds,
          createdFunds,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedRequests.length,
      requests: enrichedRequests,
    });
  } catch (error) {
    console.error("Error fetching pending deletions:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
const handleApproveDeletion = async (req, res) => {
  try {
    const request = await DeletionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "pending request not found" });
    }

    const user = await User.findById(request.userId);
    if (!user) return res.status(404).json({ msg: "User already deleted" });

    const donations = await Donator.find({ userId: user._id }).populate("fundId", "fundraiseTitle");
    const createdFunds = await CreateFund.find({ userId: user._id });

    const donatedFunds = donations.map(d => ({
      fundTitle: d.fundId?.fundraiseTitle || "Unknown",
      amount: d.amount,
      donatedAt: d.createdAt,
    }));

    const fundData = createdFunds.map(f => ({
      fundraiseTitle: f.fundraiseTitle,
      fundCategory: f.fundCategory,
     totalAmountRaised:f.totalAmountRaised,
      createdAt: f.createdAt,
      isApproved: f.isApproved,
    }));

    request.donatedFunds = donatedFunds;
    request.createdFunds = fundData;
    request.status = "approved";

    await request.save();
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ msg: "User deleted and details saved in deletion log." });
  } catch (err) {
    console.error("Error approving deletion:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


const handleRejectDeletion = async (req, res) => {
  try {
    const request = await DeletionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Pending request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ msg: "Deletion request rejected." });
  } catch (err) {
    console.error("Error rejecting deletion:", err);
    res.status(500).json({ msg: "Server error" });
  }
};






module.exports = {
     handleRequestDeletion,
     getAllPendingDeletions,
      handleApproveDeletion,
      handleRejectDeletion
}