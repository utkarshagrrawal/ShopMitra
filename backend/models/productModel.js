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
    required: true,
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
});

const Product = mongoose.model("Products", product);

module.exports = { Product };
