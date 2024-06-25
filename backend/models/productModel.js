const mongoose = require("mongoose");

const product = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  productUrl: {
    type: String,
  },
  stars: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  listPrice: {
    type: Number,
    required: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  isBestSeller: {
    type: Boolean,
    required: true,
  },
  boughtInLastMonth: {
    type: Number,
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
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Product = mongoose.model("Products", product);

module.exports = { Product };
