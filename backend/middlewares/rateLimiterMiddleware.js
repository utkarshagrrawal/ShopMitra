const requestRateLimiter = require("../models/limiterModel");

const apiRequestLimiter = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  const isIPLogged = await requestRateLimiter.findOne({
    ip,
  });
  if (isIPLogged) {
    if (isIPLogged.expireAt < Date.now()) {
      await requestRateLimiter.updateOne(
        { ip },
        { count: 20, expireAt: Date.now() + 1000 * 60 }
      );
    } else if (isIPLogged.count <= 0) {
      return res.status(429).json({ error: "Too many requests" });
    } else {
      await requestRateLimiter.updateOne({ ip }, { $inc: { count: -1 } });
    }
  } else {
    const requestRateControl = requestRateLimiter({
      ip,
      count: 20,
      expireAt: Date.now() + 1000 * 60,
    });
    await requestRateControl.save();
  }
  return next();
};

module.exports = { apiRequestLimiter };
