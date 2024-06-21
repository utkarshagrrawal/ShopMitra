const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  fetchSellerDataController,
} = require("../controllers/sellerController");
const router = express.Router();

router.get("/dashboard", authenticate, fetchSellerDataController);

module.exports = router;
