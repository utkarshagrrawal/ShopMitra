const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  fetchProductsController,
  addProductToWishlistController,
  fetchProductDetailsController,
  addRemoveProductToCartController,
  removeItemFromCartController,
  checkoutController,
} = require("../controllers/productController");
const router = express.Router();

router.get("/search", fetchProductsController);
router.post("/add-to-wishlist", authenticate, addProductToWishlistController);
router.post(
  "/add-remove-product-in-cart",
  authenticate,
  addRemoveProductToCartController
);
router.delete(
  "/remove-item-from-cart",
  authenticate,
  removeItemFromCartController
);
router.post("/checkout", authenticate, checkoutController);
router.get("/:id", authenticate, fetchProductDetailsController);

module.exports = router;
