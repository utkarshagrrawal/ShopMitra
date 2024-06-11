const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  cancelOrderDueToPaymentFailureController,
  processOrderController,
} = require("../controllers/orderController");
const router = express.Router();

router.delete(
  "/cancel-order",
  authenticate,
  cancelOrderDueToPaymentFailureController
);
router.get("/validate-order", authenticate, processOrderController);

module.exports = router;
