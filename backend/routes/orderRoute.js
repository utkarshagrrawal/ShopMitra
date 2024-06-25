const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  cancelOrderDueToPaymentFailureController,
  processOrderController,
  fetchOrderDetailsController,
} = require("../controllers/orderController");
const router = express.Router();

router.get("/validate-order", authenticate, processOrderController);
router.get("/:orderId", authenticate, fetchOrderDetailsController);

router.delete(
  "/cancel-order",
  authenticate,
  cancelOrderDueToPaymentFailureController
);

module.exports = router;
