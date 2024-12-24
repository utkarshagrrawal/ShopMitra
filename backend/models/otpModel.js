const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
    required: true,
  },
});

const OTP = mongoose.model("otp", otpSchema);

module.exports = OTP;
