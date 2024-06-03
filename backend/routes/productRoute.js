const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  fetchProductsController,
  addProductToWishlistController,
} = require("../controllers/productController");
const router = express.Router();

router.get("/search", fetchProductsController);
router.post("/add-to-wishlist", authenticate, addProductToWishlistController);

module.exports = router;
