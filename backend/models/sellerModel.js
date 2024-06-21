const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        default: 1,
      },
      totalBought: {
        type: Number,
        default: 0,
      },
      totalBoughtThisMonth: {
        type: Number,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      totalRating: {
        type: Number,
        default: 0,
      },
      totalCost: {
        type: String,
        default: 0,
      },
      totalEarnings: {
        type: String,
        default: 0,
      },
    },
  ],
  earnings: {
    type: String,
    default: 0,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = { Seller };
