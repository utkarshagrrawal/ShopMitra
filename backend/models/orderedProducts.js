const mongoose = require("mongoose");

const orderedProductsSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
});

const OrderedProducts = mongoose.model(
  "OrderedProducts",
  orderedProductsSchema
);

module.exports = {
  OrderedProducts,
};
