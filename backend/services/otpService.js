const speakeasy = require("speakeasy");

const secret = speakeasy.generateSecret({ length: 20 });

const generateOtp = () => {
  return speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
};

module.exports = generateOtp;
