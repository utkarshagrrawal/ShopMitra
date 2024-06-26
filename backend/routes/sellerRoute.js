const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  fetchSellerDataController,
  updateProductDetailsController,
  addStockController,
  fetchSellerOrdersController,
  fetchProductsInOrderController,
} = require("../controllers/sellerController");
const router = express.Router();

router.get("/order/:orderId", authenticate, fetchProductsInOrderController);
router.get("/dashboard", authenticate, fetchSellerDataController);
router.get("/orders", authenticate, fetchSellerOrdersController);

router.put("/product/:id/stock", authenticate, addStockController);
router.put("/product/:id", authenticate, updateProductDetailsController);

module.exports = router;
