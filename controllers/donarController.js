const { sendDonationNotificationToAdmin, sendThankYouEmailToDonor } = require("../emailService/emailService");
const CreateFund = require("../models/createFundModel");
const Donator = require("../models/donatorModel");

const donateAmount = async (req, res) => {
  try {
    const { fundId, amount, fullName, email, contactNumber } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!fundId || !amount || !fullName || !email || !contactNumber) {
      return res.status(400).json({ msg: "All fields are required" });
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
      fullName,
      email,
      contactNumber,
      amount,
      proofImage,
    });

    await newDonor.save();

    fund.donators.push(newDonor._id);
    fund.donationAmount += parseFloat(amount);
    fund.donationCount += 1;
    await fund.save();


    await sendDonationNotificationToAdmin({ donor: newDonor, fund });
    await sendThankYouEmailToDonor({ donor: newDonor, fund });


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
