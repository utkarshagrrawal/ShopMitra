const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtVerify = async (token) => {
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.APP_SECRET_KEY);
      return { payload: payload };
    } catch (err) {
      return { error: err };
    }
  } else {
    return { error: "Token not found" };
  }
};

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedPayload = await jwtVerify(token);
  if (decodedPayload.error) {
    res.status(401).json({ error: "Please login to proceed" });
  } else {
    req.user = decodedPayload;
    next();
  }
};

module.exports = {
  authenticate,
};
