const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");

// initialize the Mailgun client with your API key
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Send password reset email
exports.sendResetPasswordEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetPasswordLink = `http://localhost:3000/reset-password/${token}`;

    const emailData = {
      from: "password-reset@example.com",
      to: req.body.email,
      subject: "Reset your password",
      html: `
        <p>Please use the following link to reset your password:</p>
        <p>${resetPasswordLink}</p>
        <hr />
        <p>This email may contain sensitive information</p>
      `,
    };

    const sendEmailResponse = await mg.messages().send(emailData);
    console.log(sendEmailResponse);
    return res
      .status(200)
      .send({ success: true, message: "Password reset email sent" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    user.password = password;
    const updatedUser = await user.save();
    return res
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
