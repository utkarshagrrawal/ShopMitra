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
router.get("/is-logged-in", authenticate, userDetailsController);
router.post("/forgot-password", generateOtpCode);
router.post("/verify-otp", verifyOtpCode);
router.post("/reset-password", resetPasswordController);

module.exports = router;
