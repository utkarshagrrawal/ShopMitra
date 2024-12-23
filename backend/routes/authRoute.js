const express = require("express");
const {
  loginController,
  registerController,
  userDetailsController,
  generateOtpCode,
  verifyOtpCode,
  resetPasswordController,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/current-user", authenticate, userDetailsController);
router.post("/forgot-password", generateOtpCode);
router.post("/verify-otp", verifyOtpCode);
router.post("/reset-password", resetPasswordController);
router.post("/logout", (req, res) => {
  let cookieOptions = {
    maxAge: 0,
    httpOnly: true,
    path: "/",
  };
  if (process.env.ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  }
  res.cookie("token", "", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
  return;
});

module.exports = router;
