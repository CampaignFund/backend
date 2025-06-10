const { transporter } = require("../config/nodemailer/nodemailer");

const sendResetPassword = async (name, toEmail, resetPasswordLink) => {
  try {
    const mailOptions = {
      from: `"CampaignFund" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Reset Your Password - CampaignFund",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">Hello ${name},</h2>
          <p>You recently requested to reset your password for your OpportunityHub account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetPasswordLink}" style="
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              font-size: 16px;
              color: white;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
          ">Reset Password</a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">Thanks,<br/>The CampaignFund Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

const sendFundApprovalMailToAdmin = async ({ fund, user }) => {
  try {
    const mailOptions = {
      from: `"CampaignFund" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL, 
      subject: "New Fundraiser Created – Approval Required",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">New Fundraising Request</h2>
          <p>A new fundraiser has been created and is awaiting your approval.</p>

          <h3>Fund Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${fund.fundraiseTitle}</li>
            <li><strong>Category:</strong> ${fund.fundCategory}</li>
            <li><strong>Target Amount:</strong> ₹${fund.totalAmountRaised}</li>
          </ul>

          <h3>User Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
          </ul>

          <p>Please log in to the admin panel to review and approve this fundraiser.</p>

          <p style="margin-top: 20px;">Thanks,<br/>The CampaignFund Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending admin approval email:", error);
  }
};


const sendFundCreationMailToUser = async ({ fund, user }) => {
  try {
    const mailOptions = {
      from: `"CampaignFund" <${process.env.ADMIN_EMAIL}>`,
      to: user.email,
      subject: "Your Fundraiser Has Been Created - CampaignFund",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #28a745;">Hello ${user.name},</h2>
          <p>Thank you for creating a new fundraiser on CampaignFund.</p>

          <h3>Fund Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${fund.fundraiseTitle}</li>
            <li><strong>Category:</strong> ${fund.fundCategory}</li>
            <li><strong>Target Amount:</strong> ₹${fund.totalAmountRaised}</li>
          </ul>

          <p>Your request is currently under review. You will be notified once it is approved by our team.</p>

          <p style="margin-top: 20px;">Thanks for making a difference!<br/>The CampaignFund Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("User fundraising confirmation email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending user fundraising confirmation email:", error);
  }
};



module.exports = { sendResetPassword ,sendFundApprovalMailToAdmin,sendFundCreationMailToUser};
