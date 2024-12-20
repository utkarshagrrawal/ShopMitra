const otpModel = require("../models/otpModel");
const { User } = require("../models/userModel");
const { sendEmail } = require("../services/emailService");
const generateOtp = require("../services/otpService");
const {
  generateSalt,
  generateHashedPassword,
  jwtSign,
} = require("../services/passportService");

const loginLogic = async (body) => {
  const { email, password, rememberMe } = body;
  if (!email || !password) {
    return { error: "Email and password are required" };
  }
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
  const { name, email, password, phone, gender, user_type, dob } = body;
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
    user_type: user_type,
    date_of_birth: new Date(dob),
  });
  try {
    await newUser.save();
    sendEmail(
      email,
      "Welcome to Shopmitra",
      "You have successfully registered on Shopmitra",
      `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; text-align: center;">Welcome to Shopmitra!</h1>
            <p style="font-size: 16px; color: #555;">Dear ${name},</p>
            <p style="font-size: 16px; color: #555;">
                Thank you for registering on our website. We're thrilled to have you as part of the Shopmitra family!
            </p>
            <p style="font-size: 16px; color: #555;">
                You can now explore our wide range of products and enjoy exclusive member benefits. Start shopping today and make the most of your experience with us!
            </p>
            <p style="font-size: 16px; color: #555;">
                If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:utkarsh09jan@gmail.com" style="color: #3498db;">utkarsh09jan@gmail.com</a>.
            </p>
            <p style="font-size: 16px; color: #555;">Happy shopping!</p>
            <p style="font-size: 16px; color: #555; text-align: center;">Best Regards,<br>The Shopmitra Team</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://www.shopmitra.vercel.app" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Shopmitra</a>
            </div>
        </div>
    </body>`
    );
    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

const userDetailsLogic = async (user) => {
  let users;
  try {
    users = await User.find({ email: user.email, is_deleted: false });
    return {
      user: {
        name: users[0].name,
        email: users[0].email,
        phone: users[0].phone,
        address: users[0].address,
        date_of_birth: users[0].date_of_birth,
        notification_preferences: users[0].notification_preferences,
        user_type: users[0].user_type,
      },
    };
  } catch (error) {
    return { error: error.message };
  }
};

const generateOtpCodeLogic = async (body) => {
  const { email } = body;
  const user = await User.find({ email, is_deleted: false });
  if (user.length === 0) {
    return { error: "User not found" };
  }
  try {
    await otpModel.deleteMany({
      email,
      expiry: { $lt: new Date(Date.now() - 15 * 60 * 1000) },
    });
    let previousOtp = await otpModel.findOne({ email });
    if (previousOtp) {
      sendEmail(
        email,
        "Password Reset Request for shopmitra",
        `Your otp for resetting password is ${previousOtp.otp}`,
        `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 20px; background-color: #28a745; color: white; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to Shopmitra</h1>
                </div>
                <div style="margin: 20px 0; line-height: 1.6;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #555;">Hi there,</p>
                    <p style="color: #555;">We received a request to reset your password. Use the OTP below to complete your request:</p>
                    <div style="font-size: 28px; font-weight: bold; color: #28a745; background: #e9f5e9; padding: 10px; border-radius: 5px; display: inline-block; margin: 20px 0;">
                        ${previousOtp.otp}
                    </div>
                    <p style="color: #555;">If you did not request this, please ignore this email. Your account is safe.</p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                    <p>&copy; 2024 Shopmitra. All rights reserved.</p>
                </div>
            </div>
        </body>`
      );
    } else {
      const otp = generateOtp();
      await otpModel.insertMany([
        {
          email: email,
          otp: otp,
          expiry: new Date(),
        },
      ]);
      sendEmail(
        email,
        "Password Reset Request for shopmitra",
        `Your otp for resetting password is ${otp}`,
        `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 20px; background-color: #28a745; color: white; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to Shopmitra</h1>
                </div>
                <div style="margin: 20px 0; line-height: 1.6;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #555;">Hi there,</p>
                    <p style="color: #555;">We received a request to reset your password. Use the OTP below to complete your request:</p>
                    <div style="font-size: 28px; font-weight: bold; color: #28a745; background: #e9f5e9; padding: 10px; border-radius: 5px; display: inline-block; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #555;">If you did not request this, please ignore this email. Your account is safe.</p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                    <p>&copy; 2024 Shopmitra. All rights reserved.</p>
                </div>
            </div>
        </body>`
      );
    }
  } catch (err) {
    return { error: err.message };
  }
  return { success: true };
};

const verifyOtpLogic = async (body) => {
  const { email, otp } = body;
  try {
    await otpModel.deleteMany({
      email,
      expiry: { $lt: new Date(Date.now() - 15 * 60 * 1000) },
    });
    const otps = await otpModel.findOne({ email });
    if (otps && otps.length === 0) {
      return { error: "OTP has been expired" };
    }
    if (otps.otp !== otp) {
      return { error: "Invalid OTP" };
    }
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
