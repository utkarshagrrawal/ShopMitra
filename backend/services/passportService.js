const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSign = (payload, rememberMe) => {
  return jwt.sign(payload, process.env.APP_SECRET_KEY, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
};

const generateSalt = () => {
  return bcrypt.genSaltSync();
};

const generateHashedPassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

module.exports = {
  jwtSign,
  generateSalt,
  generateHashedPassword,
};
