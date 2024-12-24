const generateOtp = () => {
  let numbers = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += numbers[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = generateOtp;
