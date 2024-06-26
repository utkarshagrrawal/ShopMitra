const { Cart } = require("../models/cartModel");
const { Order } = require("../models/orderModel");
const { OrderedProducts } = require("../models/orderedProducts");
const { Product } = require("../models/productModel");

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
    const allProductsInOrder = order.products;
    await Promise.all(
      allProductsInOrder.map(async (product) => {
        await Product.updateOne(
          { _id: product.product },
          {
            $inc: { stock: -product.quantity },
            $inc: { totalBought: product.quantity },
            $inc: { totalCost: product.quantity * product.price },
            $inc: { totalEarnings: product.quantity * product.price },
          }
        );
      })
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

const fetchOrderDetailsLogic = async (params) => {
  const { orderId } = params;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return { error: "Order not found" };
    }
    const orderedProducts = await OrderedProducts.find({ orderId });
    const orderDetails = await Promise.all(
      orderedProducts.map(async (product) => {
        const productDetails = await Product.findOne({
          _id: product.product,
        });
        return {
          productId: product.product,
          quantity: product.quantity,
          productDetails,
        };
      })
    );
    return { order: order, orderDetails: orderDetails };
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  cancelOrderDueToPaymentFailureLogic,
  processOrderLogic,
  fetchOrderDetailsLogic,
};
