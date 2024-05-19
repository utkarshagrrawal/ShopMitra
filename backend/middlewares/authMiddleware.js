const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtVerify = async (token, rememberMe) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.APP_SECRET_KEY);
    } catch (err) {
      return err;
    }
  } else {
    return null;
  }
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  const decodedPayload = jwtVerify(token);
  if (decodedPayload) {
    req.user = decodedPayload;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = {
  authenticate,
};
