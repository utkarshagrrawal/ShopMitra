const { User } = require("../models/userModel");
const {
  generateSalt,
  generateHashedPassword,
  jwtSign,
} = require("../services/passportService");

const loginLogic = async (body) => {
  const { email, password, rememberMe } = body;
  const user = await User.find({ email });
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
    const token = jwtSign(email, rememberMe);
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
    users = await User.find({ email: user.email });
    return { user: users[0] };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  loginLogic,
  registerLogic,
  userDetailsLogic,
};
