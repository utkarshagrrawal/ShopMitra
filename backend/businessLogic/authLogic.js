const otpModel = require("../models/otpModel");
const { User } = require("../models/userModel");
const generateOtp = require("../services/otpService");
const {
  generateSalt,
  generateHashedPassword,
  jwtSign,
} = require("../services/passportService");
require("dotenv").config();

const loginLogic = async (body) => {
  const { email, password, rememberMe } = body;
  const user = await User.find({ email, is_deleted: false });
  if (user.length === 0) {
    return { error: "User not found" };
  }
  let hashedPassword;
  try {
    hashedPassword = await generateHashedPassword(password, user[0].hash_code);
  } catch (err) {
    return { error: err.message };
  }
  if (user[0].password !== hashedPassword) {
    return { error: "Invalid password" };
  }
  try {
    const token = jwtSign({ email }, rememberMe);
    return { token };
  } catch (err) {
    return { error: err.message };
  }
};

const registerLogic = async (body) => {
  const { name, email, password, phone, gender, dob } = body;
  const user = await User.find({ email });
  if (user.length > 0) {
    return { error: "User already exists" };
  }
  const salt = await generateSalt();
  const hashedPassword = await generateHashedPassword(password, salt);
  const newUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    hash_code: salt,
    gender: gender,
    date_of_birth: new Date(dob),
  });
  try {
    await newUser.save();
    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

const userDetailsLogic = async (user) => {
  let users;
  try {
    users = await User.find({ email: user.email, is_deleted: false });
    return { user: users[0] };
  } catch (error) {
    return { error: error.message };
  }
};

const generateOtpCodeLogic = async (body) => {
  const { email } = body;
  const user = await User.find({ email });
  if (user.length === 0) {
    return { error: "User not found" };
  }
  let previousOtp;
  try {
    previousOtp = await otpModel.find({ email });
  } catch (err) {
    return { error: err.message };
  }
  if (previousOtp.length > 0) {
    try {
      await otpModel.deleteOne({ email });
    } catch (err) {
      return { error: err.message };
    }
  }
  const otp = generateOtp();
  try {
    await otpModel.insertMany([
      {
        email: email,
        otp: otp,
        expiry: new Date(Date.now()),
      },
    ]);
  } catch (err) {
    return { error: err.message };
  }
  return {
    otp: otp,
    email_service_id: process.env.EMAIL_SERVICE_ID,
    email_template_id: process.env.EMAIL_TEMPLATE_ID,
    email_public_key: process.env.EMAIL_PUBLIC_KEY,
    email_private_key: process.env.EMAIL_PRIVATE_KEY,
  };
};

const verifyOtpLogic = async (body) => {
  const { email, otp } = body;
  const user = await otpModel.find({ email });
  if (user.length === 0) {
    return { error: "OTP not found" };
  }
  try {
    const currentTime = Date.now();
    const otpTime = Date.parse(user[0].expiry);
    const diff = currentTime - otpTime;
    if (diff > 86400) {
      await otpModel.deleteMany({ email });
      return { error: "OTP expired" };
    }
  } catch (err) {
    return { error: err.message };
  }
  if (user[0].otp !== otp) {
    return { error: "Invalid OTP" };
  }
  try {
    await otpModel.deleteMany({ email });
  } catch (err) {
    return { error: err.message };
  }
  return { message: "OTP verified successfully" };
};

const resetPasswordLogic = async (body) => {
  const { email, password, confirmPassword } = body;
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  try {
    const salt = await generateSalt();
    const hashedPassword = await generateHashedPassword(password, salt);
    await User.updateOne(
      { email },
      { password: hashedPassword, hash_code: salt }
    );
    return { message: "Password changed successfully" };
  } catch (err) {
    return { error: err.message };
  }
};

module.exports = {
  loginLogic,
  registerLogic,
  userDetailsLogic,
  generateOtpCodeLogic,
  verifyOtpLogic,
  resetPasswordLogic,
};
