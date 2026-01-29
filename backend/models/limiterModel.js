const mongoose = require("mongoose");

const requestLimiterModel = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
  expireAt: {
    type: Number,
    required: true,
  },
  lastHitAt: {
    type: Number,
    required: true,
  },
  exponentialBackoff: {
    type: Number,
    required: true,
  },
  HitsAfterLimitReached: {
    type: Number,
    required: true,
  },
});

const requestRateLimiter = mongoose.model(
  "requestRateLimiter",
  requestLimiterModel
);

module.exports = requestRateLimiter;
