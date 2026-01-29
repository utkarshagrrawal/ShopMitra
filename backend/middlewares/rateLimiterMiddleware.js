const requestRateLimiter = require("../models/limiterModel");

const apiRequestLimiter = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const ip = req.headers["x-forwarded-for"]?.split(", ")[0] || req.ip;
  const now = Date.now();

  // Use findOneAndUpdate with upsert to atomically find or create the entry
  const isIPLogged = await requestRateLimiter.findOneAndUpdate(
    { ip },
    {
      $setOnInsert: {
        ip,
        count: 100,
        expireAt: now + 1000 * 60,
        exponentialBackoff: 1,
        lastHitAt: now,
        HitsAfterLimitReached: 0,
      },
    },
    { upsert: true, new: false }
  );

  // If no document existed before, it was just created, allow the request
  if (!isIPLogged) {
    return next();
  }

  if (isIPLogged.expireAt < now) {
    await requestRateLimiter.updateOne(
      { ip },
      {
        count: 100,
        expireAt: now + 1000 * 60,
        exponentialBackoff: isIPLogged.exponentialBackoff,
        lastHitAt: now,
        HitsAfterLimitReached: 0,
      }
    );
  } else if (isIPLogged.count <= 0) {
    if (
      isIPLogged.HitsAfterLimitReached % 5 === 0 &&
      isIPLogged.HitsAfterLimitReached !== 0
    ) {
      const newBackoff = isIPLogged.exponentialBackoff * 2;
      await requestRateLimiter.updateOne(
        { ip },
        {
          count: 0,
          expireAt: now + 1000 * 60 * newBackoff,
          exponentialBackoff: newBackoff,
          lastHitAt: now,
          $inc: { HitsAfterLimitReached: 1 },
        }
      );
    } else {
      await requestRateLimiter.updateOne(
        { ip },
        {
          $inc: { HitsAfterLimitReached: 1 },
          lastHitAt: now,
        }
      );
    }
    return res.status(429).json({
      error:
        "We are temporarily limiting your requests due to high traffic. Please try again later.",
    });
  } else {
    await requestRateLimiter.updateOne(
      { ip },
      { $inc: { count: -1 }, lastHitAt: now }
    );
  }
  return next();
};

module.exports = { apiRequestLimiter };
