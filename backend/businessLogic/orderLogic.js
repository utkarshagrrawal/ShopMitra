const { Cart } = require("../models/cartModel");
const { Order } = require("../models/orderModel");

const cancelOrderDueToPaymentFailureLogic = async (query) => {
  const { orderId } = query;

  try {
    const order = await Order.findOne({
      orderId,
    });
    if (!order) {
      return { error: "Order not found" };
    }
    await Order.deleteMany({ orderId });
    return { message: "Order cancelled" };
  } catch (error) {
    return { error: error };
  }
};

const processOrderLogic = async (query) => {
  const { orderId } = query;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return { error: "Order not found" };
    }
    const updateOrderStatus = await Order.updateOne(
      { orderId },
      { status: "processed" }
    );
    if (
      updateOrderStatus.matchedCount === 0 ||
      updateOrderStatus.modifiedCount === 0
    ) {
      return { error: "Order status not updated" };
    }
    await Cart.updateOne({ email: order.email }, { $set: { products: [] } });
    return { message: "Order found" };
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  cancelOrderDueToPaymentFailureLogic,
  processOrderLogic,
};
