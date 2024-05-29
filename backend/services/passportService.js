const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSign = (payload, rememberMe) => {
  return jwt.sign(payload, process.env.APP_SECRET_KEY, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
};

const generateSalt = async () => {
  return await bcrypt.genSalt(16);
};

const generateHashedPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports = {
  jwtSign,
  generateSalt,
  generateHashedPassword,
};
