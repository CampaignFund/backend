const CreateFund = require("../models/createFundModel");
const fundReport = require("../models/fundReport");

const submitFundReport = async (req, res) => {
  try {
    const { fundId, description } = req.body;
    const userId = req.user.id;

    if (!fundId || !description) {
      return res.status(400).json({ msg: "Fund ID and description are required" });
    }
    const fund = await CreateFund.findOne({ _id: fundId, userId });

    if (!fund) {
      return res.status(403).json({ msg: "Not authorized to submit report for this fund" });
    }

    const image = req.file?.path || null;

    const report = new fundReport({
      fundId,
      userId,
      description,
      image,
    });

    await report.save();

    res.status(201).json({ msg: "Report submitted successfully", report });
  } catch (error) {
    console.error("Error submitting fund report:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getReportsByFund = async (req, res) => {
  try {
    const { fundId } = req.params;

    const reports = await fundReport.find({ fundId }).sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  submitFundReport,
  getReportsByFund,
};
