const express = require("express");
const router = express.Router();
const {
  sendResetPasswordEmail,
  resetPassword,
} = require("../controllers/passwordResetController");

// Reset password
router.post("/", resetPassword);

// Send password reset email
router.post("/send-email", sendResetPasswordEmail);

module.exports = router;
