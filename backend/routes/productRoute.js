const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  fetchProductsController,
  addProductToWishlistController,
  fetchProductDetailsController,
  addRemoveProductToCartController,
} = require("../controllers/productController");
const router = express.Router();

router.get("/search", fetchProductsController);
router.post("/add-to-wishlist", authenticate, addProductToWishlistController);
router.post(
  "/add-remove-product-in-cart",
  authenticate,
  addRemoveProductToCartController
);
router.get("/:id", fetchProductDetailsController);

module.exports = router;
