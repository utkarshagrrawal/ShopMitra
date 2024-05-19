const express = require("express");
const {
  loginController,
  registerController,
  userDetailsController,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/is-logged-in", authenticate, userDetailsController);

module.exports = router;
