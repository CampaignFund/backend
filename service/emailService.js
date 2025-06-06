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

const sendOtpForEmailVerification = async (name, toEmail, otp) => {
  try {
    const mailOptions = {
      from: `"CampaignFund" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Your OTP for Email Verification - CampaignFund",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">Hello ${name},</h2>
          <p>Thank you for registering with OpportunityHub.</p>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p style="margin-top: 20px;">Thanks,<br/>The CampaignFund Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email verification OTP sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email verification OTP:", error);
    return false;
  }
};


module.exports = { sendResetPassword , sendOtpForEmailVerification};
