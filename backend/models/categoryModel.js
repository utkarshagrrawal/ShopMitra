const mongoose = require("mongoose");

const categories = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("product_categories", categories);

module.exports = { Category };
