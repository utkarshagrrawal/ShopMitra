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
    return { error: error.toString() };
  }
};

const processOrderLogic = async (query) => {
  const { orderId } = query;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return { error: "Order not found" };
    }
    const orderedProducts = await OrderedProducts.find({ orderId });
    await Order.updateOne({ orderId }, { status: "processed" });
    await Promise.all(
      orderedProducts.map(async (item) => {
        await Product.updateOne(
          { _id: item.product },
          {
            $inc: { stock: -1 * item.quantity },
            $inc: { totalBought: item.quantity },
            $inc: { totalCost: item.quantity * item.price },
            $inc: { totalEarnings: item.quantity * item.price },
          }
        );
      })
    );
    await Cart.updateOne({ email: order.email }, { $set: { products: [] } });
    return { message: "Order found" };
  } catch (error) {
    return { error: error.toString() };
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
    return { error: error.toString() };
  }
};

module.exports = {
  cancelOrderDueToPaymentFailureLogic,
  processOrderLogic,
  fetchOrderDetailsLogic,
};
