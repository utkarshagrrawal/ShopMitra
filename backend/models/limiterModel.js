const mongoose = require("mongoose");

const requestLimiterModel = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  expireAt: {
    type: Number,
    required: true,
  },
});

const requestRateLimiter = mongoose.model(
  "requestRateLimiter",
  requestLimiterModel
);

module.exports = requestRateLimiter;
